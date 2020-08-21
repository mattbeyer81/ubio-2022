import * as mongoose from "mongoose";

import * as  Bluebird from 'bluebird';
import { GroupModel, groupSchema } from "../src/models/group-model";
(<any>mongoose).Promise = Bluebird;

const connectionString = `mongodb://localhost:27017/ubio`

console.log(`Collecting to: ${connectionString}`);
mongoose.connect(connectionString);
const connection = mongoose.connection;

it('Connect', done => {
    connection.on('open', async function () {
        console.log(`Connection open to ${connectionString} at ${(new Date).toISOString()}`);

        const Group = mongoose.model<GroupModel>('groups', new mongoose.Schema(groupSchema));

        await Group.create({
            "groupId": "e335175a-eace-4a74-b99c-c6466b6afadd",
            "group": "particle-detector",
            "createdAt": 1571418096158,                     
            "updatedAt": 1571418124127,                    
            "meta": {                                    
                "foo": 1
            }
        })
        done()
    });

})

