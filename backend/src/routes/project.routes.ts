import { Router } from 'express';
import projectController from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// We use 'projects' as resource, implying Brief ID is the Project ID
router.post('/:id/updates', projectController.createUpdate.bind(projectController));
router.get('/:id/updates', projectController.getUpdates.bind(projectController));

export default router;
