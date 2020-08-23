import { Request, Response, NextFunction } from "express";
import { groupService } from "../services/group-service";


export class GroupController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const group = await groupService.register(params.group, params.id);
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

    async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await groupService.getSummary();
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

    async getByGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await groupService.getByGroup(req.params.group);
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const deletedCount = await groupService.delete(params.group, params.id);
            res.send({ deletedCount })
        } catch (e) {
            next(e)
        }
    }

}