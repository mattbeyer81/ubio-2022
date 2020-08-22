
import * as supertest from 'supertest';
import { app } from "../src/app"

it('Goo', async done => {
    const res = await supertest(app)
        .post('/particle-detector/e335175a-eace-4a74-b99c-c6466b6afadd')
    done()
})