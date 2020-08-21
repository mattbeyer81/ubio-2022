import * as mongoose from "mongoose";
import { GroupModel, groupSchema } from "../models/group-model";

export class GroupService {
    Group: mongoose.Model<GroupModel, {}>;

    constructor(collection?: string) {
        this.Group = mongoose.model<GroupModel>(collection || 'groups', new mongoose.Schema(groupSchema));
    }

    async create(group: string, groupId: string, meta: any) {
        const updatedAt = new Date().getTime();
        let groupDocument = await this.Group.findOne({groupId});
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
}