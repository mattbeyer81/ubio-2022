import * as mongoose from "mongoose";
import { GroupModel, groupSchema } from "../models/group-model";

export class GroupService {
    Group: mongoose.Model<GroupModel, {}>;

    constructor(collection?: string) {
        this.Group = mongoose.model<GroupModel>(collection || 'groups', new mongoose.Schema(groupSchema));
    }

    async create(group: string, groupId: string, meta?: any) {
        const updatedAt = new Date().getTime();
        let groupDocument = await this.Group.findOne({ groupId });
        if (groupDocument) {
            groupDocument.updatedAt = updatedAt;
            if (meta) {
                groupDocument.meta = meta;
            }
            await groupDocument.save();
        } else {
            groupDocument = await this.Group.create({
                groupId,
                group,
                createdAt: updatedAt,
                updatedAt,
                meta
            })

        }
        return groupDocument
    }

    async delete(group: string, groupId: string) {
        const { deletedCount } = await this.Group.deleteOne({
            groupId,
            group
        })
        return deletedCount
    }

    async getInstancesByGroup(group: string) {
        return await this.Group.find({ group })
    }

    async getSummary() {
        return await this.Group.aggregate([
            {
                $group: {
                    _id: "$group",
                    instances: { $sum: 1 },
                    createdAt: { $min: "$createdAt" },
                    updatedAt: { $max: "$updatedAt" },
                },
                
            },
            { $sort: { _id: -1 } },
        ]);
    }

    /**
     * Removes expired milliseconds
     * @param {number} age - The age in milliseconds when an instances expires
     */

    async removeExpiredInstances(age: number) {
        const { deletedCount }  = await this.Group.deleteMany({
            createdAt: {
                $lte: new Date().getTime() - age
            }
        })
        return deletedCount
    }

}