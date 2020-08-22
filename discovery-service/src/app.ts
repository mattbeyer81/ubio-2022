import * as express from 'express';
import { GroupRouter } from './routers/group-routes';

export const app = express();

app.use("/", new GroupRouter().routes);
