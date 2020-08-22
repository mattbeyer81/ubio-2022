import { Router } from "express";
import { GroupController } from "../controllers/group-controller";
const router = Router();

export class GroupRouter {
  get routes() {
    const controller = new GroupController();
    router.post("/:group/:id", controller.register);
    router.delete("/:group/:id", controller.delete);
    router.get("/", controller.getSummary);
    router.get("/:group", controller.getByGroup);
    return router;
  }
}