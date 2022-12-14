import * as mongoose from "mongoose";
import * as fs from "fs"
import * as  Bluebird from 'bluebird';
import { Heart } from "../src/models/heart-model";
(<any>mongoose).Promise = Bluebird;

const connectionString = `mongodb://${process.env.MONGO_HOST || 'ubio_mongoservice_1'}:27017/ubio`

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } );
const connection = mongoose.connection;

it('Connect', done => {
    connection.on('open', async function () {
        const applicationId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
        const heart = await Heart.create({
            applicationId,
            "group": "particle-detector",
            "createdAt": 1571418096158,                     
            "updatedAt": 1571418124127,                    
            "meta": {                                    
                "foo": 1
            }
        })
        expect(heart.applicationId).toBe(applicationId)
        done()
    });

})

afterAll(async done => {
    await connection.close();
    done();
})
