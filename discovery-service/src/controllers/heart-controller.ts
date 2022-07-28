import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import { controller, Controller, httpDelete, httpGet, httpPost, next, request, response } from "inversify-express-utils";
import { GroupNotProvidedError, ApplicationIdNotProvidedError } from "../services/heart-service";
import { IHeartService } from "../services/heart-service-interface";
import { TYPES } from "../types";

@controller("/hearts")
export class HeartController implements Controller {

    private _heartService: IHeartService;
    public constructor(@inject(TYPES.HeartService) heartService: IHeartService) {
      this._heartService = heartService;
    }

    @httpPost("/:group/:id")
    private async register(@request() req: Request, @response() res: Response, @next() next: NextFunction) {
        try {
            const params = req.params;
            const group = await this._heartService.register(params.group, params.id, req.body);
            res.send(group)
        } catch (e: any) {
            if (e instanceof GroupNotProvidedError || ApplicationIdNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }

    @httpGet("/")
    private async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await this._heartService.getSummary();
            res.send(group)
        } catch (e) {
            next(e)
        }
    }    

    @httpGet("/:group")
    private async getByGroup(req: Request, res: Response, next: NextFunction) {
        try {
            const group = await this._heartService.getByGroup(req.params.group);
            res.send(group)
        } catch (e) {
            if (e instanceof GroupNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }

    @httpDelete("/:group/:id")
    private async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const params = req.params;
            const deletedCount = await this._heartService.delete(params.group, params.id);
            res.send({ deletedCount })
        } catch (e: any) {
            if (e instanceof GroupNotProvidedError || ApplicationIdNotProvidedError) {
                res.status(404).send(e.message)
            } else {
                next(e)
            }
        }
    }    
}
