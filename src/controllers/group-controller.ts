import { Request, Response, NextFunction } from "express";
import { groupService } from "../services/group-service";


export class GroupController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const group = await groupService.create(params.group, params.id);
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

}