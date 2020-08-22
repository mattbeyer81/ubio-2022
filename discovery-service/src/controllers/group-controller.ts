import { Request, Response, NextFunction } from "express";
import { GroupService } from "../services/group-service";


export class GroupController {
    groupService: GroupService;
    constructor() {
        this.groupService = new GroupService
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const group = await this.groupService.create(params.group, params.id);
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

}