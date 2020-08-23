import { Application } from "../models/application-model";

class ApplicationService {
    async register(group: string, groupId: string, meta?: any) {
        const updatedAt = new Date().getTime();
        let groupDocument = await Application.findOne({ groupId });
        if (groupDocument) {
            groupDocument.updatedAt = updatedAt;
            if (meta) {
                groupDocument.meta = meta;
            }
            await groupDocument.save();
        } else {
            groupDocument = await Application.create({
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
        const { deletedCount } = await Application.deleteOne({
            groupId,
            group
        })
        return deletedCount || 0
    }

    async getByGroup(group: string) {
        return await Application.find({ group })
    }

    async getSummary() {
        return await Application.aggregate([
            {
                $group: {
                    _id: "$group",
                    instances: { $sum: 1 },
                    createdAt: { $min: "$createdAt" },
                    lastUpdatedAt: { $max: "$updatedAt" },
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
        const { deletedCount }  = await Application.deleteMany({
            createdAt: {
                $lte: new Date().getTime() - age
            }
        })
        return deletedCount || 0
    }

}

export const groupService = new ApplicationService