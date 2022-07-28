import { Heart, IHeart } from "../models/heart-model";
import { Registration, Summary } from "../responses";
import { GroupNotProvidedError } from "../services/heart-service";
import { IHeartRepository } from "./heart-repository-interface";

export class HeartRepository implements IHeartRepository {

    public async findOneByApplicationId(applicationId: string) {
        const heart = await Heart.findOne({ applicationId });
        const json = heart?.toJSON();
        return json as IHeart;
    }

    public async create(heart: IHeart) {
        return (await Heart.create(heart)).toJSON() as IHeart;
    }

    public async save(heart: IHeart) {
        await Heart.updateOne({ _id: heart.id }, heart);
    }

    public async deleteOne(applicationId: string, group: string) { 
        const { deletedCount } = await Heart.deleteOne({
            applicationId,
            group
        });
        return deletedCount;
    }


    async getByGroup(group: string): Promise<Registration[]> {
        if (!group) {
            throw new GroupNotProvidedError
        }
        const registrations: Registration[] = await Heart.aggregate([
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
                    createdAt: 1,
                    meta: 1
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

}