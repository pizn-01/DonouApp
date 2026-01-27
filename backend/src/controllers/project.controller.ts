import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { projectService } from '../services/project.service';

export class ProjectController {
    /**
     * Post Update
     * POST /api/projects/:id/updates
     */
    async createUpdate(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { content, type } = req.body;
            const userId = req.user!.id;

            const update = await projectService.createUpdate(id, userId, content, type);
            res.json({ success: true, data: update });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get Updates
     * GET /api/projects/:id/updates
     */
    async getUpdates(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const updates = await projectService.getUpdates(id);
            res.json({ success: true, data: updates });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new ProjectController();
