
import * as supertest from 'supertest';
import { app } from "../src/app"
import { heartService, GroupNotProvidedError, ApplicationIdNotProvidedError } from '../src/services/heart-service';
import { HeartModel } from '../src/models/heart-model';
import { v4 as uuidv4 } from 'uuid';
import { Registration } from '../src/responses';

it('Register application instance for first time', async done => {
    const createdAt = 1598105159821;
    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    const meta = { foo: 1 };
    jest.spyOn(heartService, 'register').mockImplementation((group: string, applicationId: string, meta: any) => {
        return Promise.resolve({
            "id": applicationId,
            "group": "particle-detector",
            "createdAt": createdAt,
            "updatedAt": createdAt,
            meta
        })
    })
    const res = await supertest(app)
        .post('/particle-detector/' + applicationId)
        .send(meta)
    const instance: Registration = res.body;
    expect(instance.id).toBe(applicationId)
    expect(instance.createdAt).toBe(createdAt)
    expect(instance.updatedAt).toBe(createdAt)
    expect(instance.meta).toStrictEqual(meta)

    done()
})

it('Register instance for first time - with no id', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    jest.spyOn(heartService, 'register').mockImplementation((group: string, groupId: string) => {
        throw new ApplicationIdNotProvidedError()
    })

    const res = await supertest(app)
        .post('/particle-detector/' + applicationId)
    expect(res.status).toBe(404)
    expect(res.text).toBe('Group id not provided')

    done()
})

it('Register instance for first time - with no group', async done => {

    const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    jest.spyOn(heartService, 'register').mockImplementation((group: string, groupId: string) => {
        throw new GroupNotProvidedError()
    })

    const res = await supertest(app)
        .post('/particle-detector/' + applicationId)
    expect(res.status).toBe(404)
    expect(res.text).toBe('Group not provided')

    done()
})

it('Delete instance', async done => {
    const groupId = uuidv4();
    const group = 'particle-detector';

    jest.spyOn(heartService, 'delete').mockImplementation((groupId: string) => {
        return Promise.resolve(1)
    })

    const deleteResponse = await supertest(app)
        .delete(`/${group}/${groupId}`)

    expect(deleteResponse.body.deletedCount).toBe(1)

    done()
})

it('Delete instance - no group provided', async done => {
    const groupId = uuidv4();
    const group = 'particle-detector';

    jest.spyOn(heartService, 'delete').mockImplementation((group: string, groupId: string) => {
        throw new GroupNotProvidedError()
    })

    const response = await supertest(app)
        .delete(`/${group}/${groupId}`)

        expect(response.status).toBe(404)
        expect(response.text).toBe('Group not provided')

    done()
})

it('Delete instance - no id provided', async done => {
    const groupId = uuidv4();
    const group = 'particle-detector';

    jest.spyOn(heartService, 'delete').mockImplementation((group: string, groupId: string) => {
        throw new ApplicationIdNotProvidedError()
    })

    const response = await supertest(app)
        .delete(`/${group}/${groupId}`)

        expect(response.status).toBe(404)
        expect(response.text).toBe('Group id not provided')

    done()
})

it('Get summary', async done => {
    jest.spyOn(heartService, 'getSummary').mockImplementation(() => {
        return Promise.resolve([
            {
                "group": "particle-detector",
                "instances": 2,
                "createdAt": 1598163492534,
                "lastUpdatedAt": 1598163492619
            },
            {
                "group": "not-particle-detector",
                "instances": 4,
                "createdAt": 1598163492628,
                "lastUpdatedAt": 1598163492695
            }
        ])
    })

    const response = await supertest(app).get('/');

    const body = response.body;
    const [firstGroup, secondGroup] = body;
    expect(firstGroup.createdAt).toBe(1598163492534)
    expect(firstGroup.lastUpdatedAt).toBe(1598163492619)
    expect(secondGroup.createdAt).toBe(1598163492628)
    expect(secondGroup.lastUpdatedAt).toBe(1598163492695)

    done()
})


it('Get instances by group', async done => {
    const group = 'particle-detector';
    jest.spyOn(heartService, 'getByGroup').mockImplementation((group: string) => {
        return Promise.resolve([
            {
                "id": "7e14d0f7-6d3d-4372-bdff-ce85649e3874",
                group,
                "createdAt": 1598163959678,
                "updatedAt": 1598163959678,
            },
            {
                "id": "5f420bf75b46ad174421f261",
                group,
                "createdAt": 1598163959735,
                "updatedAt": 1598163959735,
            }
        ] as HeartModel[])
    })

    const response = await supertest(app).get('/' + group);

    const body: HeartModel[] = response.body;

    body.forEach(instance => {
        expect(instance.group).toBe(group)
    });


    done()
})

it('Get instances by group - no group provided', async done => {
    const group = 'particle-detector';
    jest.spyOn(heartService, 'getByGroup').mockImplementation((group: string) => {
        throw new GroupNotProvidedError()
    })

    const res = await supertest(app).get('/' + group);
    expect(res.status).toBe(404)
    expect(res.text).toBe('Group not provided')

    done()
})