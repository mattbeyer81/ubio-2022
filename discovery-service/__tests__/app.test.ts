
import * as supertest from 'supertest';
import { app } from "../src/app"
import { ubioConnection } from '../src/data-access';
import { v4 as uuidv4 } from 'uuid';
import { Group } from '../src/models/group-model';

beforeAll(done => {
    if (ubioConnection.readyState === 1) {
        done()
    } else {
        ubioConnection.on('open', async function () {
            done();
        });
    }
})

it('Register instance for first time', async done => {
    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    const res = await supertest(app)
        .post('/particle-detector/' + groupId)
    const instance = res.body;
    expect(instance.groupId).toBe(groupId)
    expect(instance.createdAt).toBe(instance.updatedAt)

    done()
})

it('Update instance', async done => {
    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';

    const firstResponse = await supertest(app)
        .post('/particle-detector/' + groupId)

    const secondResponse = await supertest(app)
        .post('/particle-detector/' + groupId)

    const firstInstance = firstResponse.body; 
    const secondInstance = secondResponse.body; 

    expect(firstInstance.createdAt).toBe(secondInstance.createdAt)
    expect(firstInstance._id).toBe(secondInstance._id)
    expect(firstInstance.updatedAt).toBeLessThan(secondInstance.updatedAt)

    done()
})

it('Delete instance', async done => {
    const groupId = uuidv4();
    const group = 'particle-detector';                                                                                                                                            

    await supertest(app)
        .post(`/${group}/${group}`)

    const beforeDelete = await Group.findOne({ groupId });
    expect(beforeDelete && beforeDelete.groupId).toBe(groupId)

    const deleteResponse = await supertest(app)
        .delete(`/${group}/${group}`)


    expect(deleteResponse.text).toBe(1)
    const afteDelete = await Group.findOne({ groupId });
    expect(afteDelete).toBe(null)

    done()
})

it('Get summary', async done => {
    done()
})


it('Get instances by group', async done => {
    done()
})


afterAll(async done => {
    await ubioConnection.close();
    done();
})