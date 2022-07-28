import "reflect-metadata";
import { connect, connection } from "mongoose";
import { IHeart } from "../../src/models/heart-model";
import { HeartRepository } from "../../src/repositories/heart-repository";
import { IHeartRepository } from "../../src/repositories/heart-repository-interface";

it('create works', async() => {

    await connect('mongodb://localhost:27017/test');

    const heartRepository: IHeartRepository = new HeartRepository();
    const expected: IHeart = {
        applicationId: "some-application-id",
        group: "some-group",
        createdAt: 123,
        updatedAt: 456,
        meta: {
            someProperty: "some-value"
        }
    };

    let actual: IHeart | null = null;
    try {
        actual = await heartRepository.create(expected);
    } catch(e) {

    }

    await heartRepository.deleteOne(expected.applicationId, expected.group);

    expect(actual?.group).toBe(expected.group);
    await connection.close();

});