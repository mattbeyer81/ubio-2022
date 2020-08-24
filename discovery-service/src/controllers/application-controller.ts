import { Request, Response, NextFunction } from "express";
import { heartService, GroupNotProvidedError, ApplicationIdNotProvidedError } from "../services/heart-service";


export class ApplicationController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const group = await heartService.register(params.group, params.id);
            res.send(group)
        } catch (e) {
            if (e instanceof GroupNotProvidedError || ApplicationIdNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }

    async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await heartService.getSummary();
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

    async getByGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await heartService.getByGroup(req.params.group);
            res.send(group)
        } catch (e) {
            if (e instanceof GroupNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const deletedCount = await heartService.delete(params.group, params.id);
            res.send({ deletedCount })
        } catch (e) {
            if (e instanceof GroupNotProvidedError || ApplicationIdNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }

}