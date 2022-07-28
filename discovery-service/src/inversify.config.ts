import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import { HeartService } from "./services/heart-service";

let container = new Container();
container.bind<HeartService>(TYPES.HeartService).to(HeartService);

export { container };