import { Router } from "express";
import { ApplicationController } from "../controllers/application-controller";
const router = Router();

export class ApplicationRouter {
  get routes() {
    const controller = new ApplicationController();
    router.post("/:group/:id", controller.register);
    router.delete("/:group/:id", controller.delete);
    router.get("/", controller.getSummary);
    router.get("/:group", controller.getByGroup);
    return router;
  }
}