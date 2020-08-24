import * as express from 'express';
import * as bodyParser from 'body-parser'
import { HeartRouter } from './routers/application-routes';

export const app = express();

app.use(bodyParser.json())
app.use("/", new HeartRouter().routes);
