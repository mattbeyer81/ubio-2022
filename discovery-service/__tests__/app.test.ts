
import * as supertest from 'supertest';
import { app } from "../src/app"
import { ubioConnection } from '../src/data-access';

beforeAll(done => {
    if (ubioConnection.readyState === 1) {
        done()
    } else {
        ubioConnection.on('open', async function () {
            done();
        });
    }
})

it('Create New Post', async done => {
    const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
    const res = await supertest(app)
        .post('/particle-detector/' + groupId)
    expect(res.body.groupId).toBe(groupId)
    done()
})

it('Update Post', async done => {
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

afterAll(async done => {
    await ubioConnection.close();
    done();
})