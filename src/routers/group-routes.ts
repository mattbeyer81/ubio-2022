import { Router } from "express";
import { GroupController } from "../controllers/group-controller";
const router = Router();

export class GroupRouter {
  get routes() {
    const controller = new GroupController();
    router.post("/:group/:id", controller.create);
    return router;
  }
}