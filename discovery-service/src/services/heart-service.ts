import { Heart } from "../models/heart-model";
import { Registration, Summary } from "../responses";

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

class HeartService {
    async register(group: string, applicationId: string, meta?: any) {

        if (!group) {
            throw new GroupNotProvidedError
        }

        if (!applicationId) {
            throw new ApplicationIdNotProvidedError
        }

        const updatedAt = new Date().getTime();
        let heartDocument = await Heart.findOne({ applicationId });
        if (heartDocument) {
            heartDocument.updatedAt = updatedAt;
            if (meta) {
                heartDocument.meta = meta;
            }
            await heartDocument.save();
        } else {
            heartDocument = await Heart.create({
                applicationId,
                group,
                createdAt: updatedAt,
                updatedAt,
                meta
            })

        }
        const registration: Registration = {
            id: heartDocument.applicationId,
            group: heartDocument.group,
            createdAt: heartDocument.createdAt,
            updatedAt: heartDocument.updatedAt,
            meta: heartDocument.meta
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
        const { deletedCount } = await Heart.deleteOne({
            applicationId,
            group
        })
        return deletedCount || 0
    }

    async getByGroup(group: string): Promise<Registration[]> {
        if (!group) {
            throw new GroupNotProvidedError
        }
        const registrations = await Heart.aggregate([
            { 
                $match: {
                    group
                }
            },
            {
                $project: {
                    _id: 0,
                    id: "$applicationId",
                    group: 1,
                    updatedAt: 1,
                    createdAt: 1
                }
            },
            { $sort: { id: 1  } }

        ])
        return registrations
    }

    async getSummary(): Promise<Summary> {
        return await Heart.aggregate([
            {
                $group: {
                    _id: "$group",
                    instances: { $sum: 1 },
                    createdAt: { $min: "$createdAt" },
                    lastUpdatedAt: { $max: "$updatedAt" },
                },
                
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    group: "$_id",
                    instances: 1,
                    createdAt: 1,
                    lastUpdatedAt: 1,
                }
            }
        ]);
    }

    /**
     * Removes expired milliseconds
     * @param {number} age - The age in milliseconds when an instances expires
     */

    async removeExpiredInstances(age: number) {
        const { deletedCount }  = await Heart.deleteMany({
            createdAt: {
                $lte: new Date().getTime() - age
            }
        })
        return deletedCount || 0
    }

}

export const heartService = new HeartService