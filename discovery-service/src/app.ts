import * as express from 'express';
import { ApplicationRouter } from './routers/application-routes';

export const app = express();

app.use("/", new ApplicationRouter().routes);
