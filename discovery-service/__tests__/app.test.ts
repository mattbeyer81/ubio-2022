
import * as supertest from 'supertest';
import { app } from "../src/app"
import { applicationService } from '../src/services/application-service';
import { ApplicationModel } from '../src/models/application-model';
import { v4 as uuidv4 } from 'uuid';
import { ResponseInstance } from '../src/responses';


it('Register instance for first time', async done => {

    const createdAt = 1598105159821;

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    jest.spyOn(applicationService, 'register').mockImplementation((group: string, groupId: string) => {
        return Promise.resolve({
            "id": "5f4126477e642662ad7c59f5",
            "group": "particle-detector",
            "createdAt": createdAt,
            "updatedAt": createdAt,
            "meta": {
                "foo": 1
            }
        } as ResponseInstance)
    })

    const res = await supertest(app)
        .post('/particle-detector/' + groupId)
    const instance = res.body;
    expect(instance.groupId).toBe(groupId)
    expect(instance.createdAt).toBe(createdAt)
    expect(instance.updatedAt).toBe(createdAt)

    done()
})

it('Register instance for first time - with no groupId', async done => {

    const createdAt = 1598105159821;

    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    jest.spyOn(applicationService, 'register').mockImplementation((group: string, groupId: string) => {
        throw new Error('')
        return Promise.resolve({
            "_id": "5f4126477e642662ad7c59f5",
            "groupId": groupId,
            "group": "particle-detector",
            "createdAt": createdAt,
            "updatedAt": createdAt,
            "__v": 0,
            "meta": {
                "foo": 1
            }
        } as ApplicationModel)
    })

    const res = await supertest(app)
        .post('/particle-detector/' + groupId)
    const instance = res.body;
    expect(instance.groupId).toBe(groupId)
    expect(instance.createdAt).toBe(createdAt)
    expect(instance.updatedAt).toBe(createdAt)

    done()
})

it('Delete instance', async done => {
    const groupId = uuidv4();
    const group = 'particle-detector';                                                                                                                                            

    jest.spyOn(applicationService, 'delete').mockImplementation((groupId: string) => {
        return Promise.resolve(1)
    })

    const deleteResponse = await supertest(app)
        .delete(`/${group}/${groupId}`)

    expect(deleteResponse.body.deletedCount).toBe(1)

    done()
})

it('Get summary', async done => {
    jest.spyOn(applicationService, 'getSummary').mockImplementation(() => {
        return Promise.resolve([
            {
                "_id": "particle-detector",
                "instances": 2,
                "createdAt": 1598163492534,
                "lastUpdatedAt": 1598163492619
            },
            {
                "_id": "not-particle-detector",
                "instances": 4,
                "createdAt": 1598163492628,
                "lastUpdatedAt": 1598163492695
            }
        ])
    })

    const response = await supertest(app).get('/');

    const body = response.body;
    const [ firstGroup, secondGroup ] = body;
    expect(firstGroup.createdAt).toBe(1598163492534)
    expect(firstGroup.lastUpdatedAt).toBe(1598163492619)
    expect(secondGroup.createdAt).toBe(1598163492628)
    expect(secondGroup.lastUpdatedAt).toBe(1598163492695)

    done()
})


it('Get instances by group', async done => {
    const group = 'particle-detector';
    jest.spyOn(applicationService, 'getByGroup').mockImplementation((group: string) => {
        return Promise.resolve([
            {
                "_id": "5f420bf75b46ad174421f260",
                "groupId": "7e14d0f7-6d3d-4372-bdff-ce85649e3874",
                group,
                "createdAt": 1598163959678,
                "updatedAt": 1598163959678,
                "__v": 0
            },
            {
                "_id": "5f420bf75b46ad174421f261",
                "groupId": "a04f27db-2191-4451-8f82-074f22cd2cdc",
                group,
                "createdAt": 1598163959735,
                "updatedAt": 1598163959735,
                "__v": 0
            }
        ] as ApplicationModel[])
    })

    const response = await supertest(app).get('/' + group);

    const body: ApplicationModel[] = response.body;

    body.forEach(instance => {
        expect(instance.group).toBe(group)
    });


    done()
})

