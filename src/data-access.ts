import * as mongoose from "mongoose";

import * as  Bluebird from 'bluebird';
import { GroupModel, groupSchema } from "../src/models/group-model";
(<any>mongoose).Promise = Bluebird;

const connectionString = `mongodb://localhost:27017/ubio`

console.log(`Collecting to: ${connectionString}`);
mongoose.connect(connectionString);
export const ubioConnection = mongoose.connection;