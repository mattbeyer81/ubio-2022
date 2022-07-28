import { Registration, Summary } from "../responses";

export interface IHeartService {

    register(group: string, applicationId: string, meta?: any): Promise<Registration>;
    delete(group: string, applicationId: string): Promise<number>;
    getByGroup(group: string): Promise<Registration[]>;
    removeExpiredInstances(age: number): Promise<number>;
    getSummary(): Promise<Summary>;

}