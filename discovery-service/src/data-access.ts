import * as mongoose from "mongoose";
import * as  Bluebird from 'bluebird';
(<any>mongoose).Promise = Bluebird;

const connectionString = `mongodb://ubio_mongoservice_1:27017/ubio`

console.log(`Collecting to: ${connectionString}`);
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true } );
export const ubioConnection = mongoose.connection; 