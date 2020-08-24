import * as express from 'express';
import * as bodyParser from 'body-parser'
import { ApplicationRouter } from './routers/application-routes';

export const app = express();

app.use(bodyParser.json())
app.use("/", new ApplicationRouter().routes);
