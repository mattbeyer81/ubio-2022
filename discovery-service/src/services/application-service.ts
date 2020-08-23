import { Application } from "../models/application-model";
import { ResponseInstance } from "../responses";

class ApplicationService {
    async register(group: string, groupId: string, meta?: any) {
        const updatedAt = new Date().getTime();
        let appplicationDocument = await Application.findOne({ groupId });
        if (appplicationDocument) {
            appplicationDocument.updatedAt = updatedAt;
            if (meta) {
                appplicationDocument.meta = meta;
            }
            await appplicationDocument.save();
        } else {
            appplicationDocument = await Application.create({
                groupId,
                group,
                createdAt: updatedAt,
                updatedAt,
                meta
            })

        }
        const responseInstance: ResponseInstance = {
            id: appplicationDocument.groupId,
            group: appplicationDocument.group,
            createdAt: appplicationDocument.createdAt,
            updatedAt: appplicationDocument.updatedAt,
            meta: appplicationDocument.meta
        }
        return responseInstance
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

export const applicationService = new ApplicationService