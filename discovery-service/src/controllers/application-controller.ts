import { Request, Response, NextFunction } from "express";
import { applicationService, GroupNotProvidedError, ApplicationIdNotProvidedError } from "../services/application-service";


export class ApplicationController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const group = await applicationService.register(params.group, params.id);
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
            const group = await applicationService.getSummary();
            res.send(group)
        } catch (e) {
            next(e)
        }
    }

    async getByGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await applicationService.getByGroup(req.params.group);
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
            const deletedCount = await applicationService.delete(params.group, params.id);
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