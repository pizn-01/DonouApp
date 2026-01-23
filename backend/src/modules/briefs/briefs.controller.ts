import { Response, NextFunction } from 'express';
import { briefsService } from './briefs.service';
import { AuthenticatedRequest } from '../../types';
import { sendSuccess, sendCreated, sendNoContent } from '../../utils';
import { Errors } from '../../middleware';
import {
    CreateBriefInput,
    UpdateBriefInput,
    GenerateBriefInput,
    BriefQuery
} from './briefs.schemas';

export class BriefsController {
    /**
     * POST /briefs - Create a new brief
     */
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const input = req.body as CreateBriefInput;
            const result = await briefsService.create(req.userId, input);
            sendCreated(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /briefs/ai-generate - Generate brief with AI
     */
    async generateWithAI(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const input = req.body as GenerateBriefInput;
            const result = await briefsService.generateWithAI(req.userId, input);
            sendCreated(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /briefs - Get all briefs for the authenticated brand
     */
    async findAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const query = req.query as unknown as BriefQuery;
            const result = await briefsService.findByBrand(req.userId, query);
            sendSuccess(res, result.briefs, 200, result.pagination);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /briefs/:id - Get a single brief
     */
    async findOne(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const id = req.params.id as string;
            const result = await briefsService.findById(id, req.userId);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /briefs/:id - Update a brief
     */
    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const id = req.params.id as string;
            const input = req.body as UpdateBriefInput;
            const result = await briefsService.update(id, req.userId, input);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /briefs/:id - Delete a brief
     */
    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const id = req.params.id as string;
            await briefsService.delete(id, req.userId);
            sendNoContent(res);
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /briefs/:id/publish - Publish a draft brief
     */
    async publish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            if (!req.userId) {
                throw Errors.unauthorized();
            }

            const id = req.params.id as string;
            const result = await briefsService.publish(id, req.userId);
            sendSuccess(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export const briefsController = new BriefsController();
