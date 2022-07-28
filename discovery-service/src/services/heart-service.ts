import { inject, injectable } from "inversify";
import { Heart } from "../models/heart-model";
import { IHeartRepository } from "../repositories/heart-repository-interface";
import { Registration, Summary } from "../responses";
import { TYPES } from "../types";
import { IHeartService } from "./heart-service-interface";

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

@injectable()
export class HeartService implements IHeartService {

    private _heartRepository: IHeartRepository;

    public constructor(
	    @inject(TYPES.HeartRepository) heartRepository: IHeartRepository
    ) {
        this._heartRepository = heartRepository;
    }

    public async register(group: string, applicationId: string, meta?: any) {

        if (!group) {
            throw new GroupNotProvidedError
        }

        if (!applicationId) {
            throw new ApplicationIdNotProvidedError
        }

        const updatedAt = new Date().getTime();
        let heart = await this._heartRepository.findOneByApplicationId(applicationId);
        if (heart) {
            heart.updatedAt = updatedAt;
            if (meta) {
                heart.meta = meta;
            }
            await this._heartRepository.save(heart);
        } else {
            heart = await this._heartRepository.create({
                applicationId,
                group,
                createdAt: updatedAt,
                updatedAt,
                meta
            })

        }
        const registration: Registration = {
            id: heart.applicationId,
            group: heart.group,
            createdAt: heart.createdAt,
            updatedAt: heart.updatedAt,
            meta: heart.meta
        }
        return registration
    }

    public async delete(group: string, applicationId: string) {
        if (!group) {
            throw new GroupNotProvidedError
        }
        if (!applicationId) {
            throw new ApplicationIdNotProvidedError
        }
        const deletedCount = await this._heartRepository.deleteOne(applicationId, group);
        return deletedCount || 0
    }

    public async getByGroup(group: string): Promise<Registration[]> {
        if (!group) {
            throw new GroupNotProvidedError
        }
        const registrations = await this._heartRepository.getByGroup(group);
        return registrations
    }

    public async getSummary(): Promise<Summary> {
        return await this._heartRepository.getSummary();
    }

    /**
     * Removes expired milliseconds
     * @param {number} age - The age in milliseconds when an instances expires
     */

     public async removeExpiredInstances(age: number) {
        const { deletedCount }  = await Heart.deleteMany({
            createdAt: {
                $lte: new Date().getTime() - age
            }
        })
        return deletedCount || 0
    }

}