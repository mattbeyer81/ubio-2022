import { Application } from "../models/application-model";
import { Registration } from "../responses";

export class GroupNotProvidedError extends Error {
    constructor(m?: string) {
        super(m);
        this.message = 'Group not provided'
        Object.setPrototypeOf(this, GroupNotProvidedError.prototype);
    }
}

export class ApplicationIdNotProvidedError extends Error {
    constructor(m?: string) {
        super(m);
        this.message = 'Group id not provided'
        Object.setPrototypeOf(this, ApplicationIdNotProvidedError.prototype);
    }
}

class ApplicationService {
    async register(group: string, applicationId: string, meta?: any) {

        if (!group) {
            throw new GroupNotProvidedError
        }

        if (!applicationId) {
            throw new ApplicationIdNotProvidedError
        }

        const updatedAt = new Date().getTime();
        let appplicationDocument = await Application.findOne({ applicationId });
        if (appplicationDocument) {
            appplicationDocument.updatedAt = updatedAt;
            if (meta) {
                appplicationDocument.meta = meta;
            }
            await appplicationDocument.save();
        } else {
            appplicationDocument = await Application.create({
                applicationId,
                group,
                createdAt: updatedAt,
                updatedAt,
                meta
            })

        }
        const registration: Registration = {
            id: appplicationDocument.applicationId,
            group: appplicationDocument.group,
            createdAt: appplicationDocument.createdAt,
            updatedAt: appplicationDocument.updatedAt,
            meta: appplicationDocument.meta
        }
        return registration
    }

    async delete(group: string, applicationId: string) {
        if (!group) {
            throw new GroupNotProvidedError
        }
        if (!applicationId) {
            throw new ApplicationIdNotProvidedError
        }
        const { deletedCount } = await Application.deleteOne({
            applicationId,
            group
        })
        return deletedCount || 0
    }

    async getByGroup(group: string) {
        if (!group) {
            throw new GroupNotProvidedError
        }
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
            { $sort: { _id: 1 } },
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