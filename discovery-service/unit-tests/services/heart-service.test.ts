import "reflect-metadata";

import { mock } from 'jest-mock-extended';
import { Container } from "inversify";
import "../../src/controllers/heart-controller";
import { TYPES } from "../../src/types";
import { IHeartService } from "../../src/services/heart-service-interface";
import { IHeartRepository } from "../../src/repositories/heart-repository-interface";
import { IHeart } from "../../src/models/heart-model";
import { HeartService } from "../../src/services/heart-service";

it('register works', async() => {

    const mockHeartService = mock<IHeartRepository>();

    const expected: IHeart = {
        id: "some-id",
        applicationId: "some-application-id",
        group: "some-group",
        createdAt: 123,
        updatedAt: 234,
        meta: {
            someProperty: "some-value"
        }       
    } 
    mockHeartService.findOneByApplicationId.mockResolvedValue(expected);

    const container = new Container();
    container.bind<IHeartRepository>(TYPES.HeartRepository).toConstantValue(mockHeartService);
    container.bind<IHeartService>(TYPES.HeartService).to(HeartService);  

    const heartService = container.get<HeartService>(TYPES.HeartService);
    const registration = await heartService.register(expected.group, expected.applicationId, expected.meta);

    expect(expected.group).toBe(registration.group);
    expect(expected.applicationId).toBe(registration.id);
    expect(expected.meta).toStrictEqual(registration.meta);
    expect(expected.updatedAt).toBe(registration.updatedAt);
    expect(expected.createdAt).toBe(registration.createdAt);

}, 1000000)