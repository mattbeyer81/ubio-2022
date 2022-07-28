import { IHeart } from "../models/heart-model";
import { Registration, Summary } from "../responses";

export interface IHeartRepository {
    findOneByApplicationId(applicationId: string): Promise<IHeart> ;
    create(heart: IHeart): Promise<IHeart> ;
    deleteOne(applicationId: string, group: string): Promise<number>;
    getByGroup(group: string): Promise<Registration[]>;
    getSummary(): Promise<Summary>;
    save(heart: IHeart): Promise<void>;
}