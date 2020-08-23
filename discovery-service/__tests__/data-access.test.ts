import * as mongoose from "mongoose";
import * as  Bluebird from 'bluebird';
import { Application } from "../src/models/application-model";
(<any>mongoose).Promise = Bluebird;

const connectionString = `mongodb://${process.env.MONGO_HOST || 'ubio_mongoservice_1'}:27017/ubio`

console.log(`Collecting to: ${connectionString}`);
mongoose.connect(connectionString);
const connection = mongoose.connection;

it('Connect', done => {
    connection.on('open', async function () {
        console.log(`Connection open to ${connectionString} at ${(new Date).toISOString()}`);

        const groupId = 'e335175a-eace-4a74-b99c-c6466b6afadd';
        const group = await Application.create({
            groupId,
            "group": "particle-detector",
            "createdAt": 1571418096158,                     
            "updatedAt": 1571418124127,                    
            "meta": {                                    
                "foo": 1
            }
        })
        expect(group.groupId).toBe(groupId)
        done()
    });

})

afterAll(async done => {
    await connection.close();
    done();
})
