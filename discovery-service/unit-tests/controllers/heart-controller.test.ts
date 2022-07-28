import "reflect-metadata";

import { mock } from 'jest-mock-extended';
import * as request from "supertest";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import "../../src/controllers/heart-controller";
import { TYPES } from "../../src/types";
import { IHeartService } from "../../src/services/heart-service-interface";
import { Registration } from "../../src/responses";

it('get registration works', async() => {

    const mockHeartService = mock<IHeartService>();

    const expectedRegistration: Registration = {
        id: "some-id",
        group: "some-group",
        createdAt: 123,
        updatedAt: 234,
        meta: { someProperty: "some-value"}
    } 
    mockHeartService.register.mockResolvedValue(expectedRegistration);

    const container = new Container();
    container.bind<IHeartService>(TYPES.HeartService).toConstantValue(mockHeartService);  
    const server = new InversifyExpressServer(container);
    const response = await request(server.build()).post("/hearts/some-group/some-id");
    const actualRegistration: Registration = response.body;

    expect(expectedRegistration).toStrictEqual(actualRegistration);

}, 1000000)