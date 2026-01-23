import { Router } from 'express';
import { briefsController } from './briefs.controller';
import { validate, authenticate, authorize, aiLimiter } from '../../middleware';
import { UserRole } from '../../types';
import {
    createBriefSchema,
    updateBriefSchema,
    generateBriefSchema,
    briefQuerySchema
} from './briefs.schemas';

const router = Router();

// All routes require authentication and BRAND role
router.use(authenticate);
router.use(authorize(UserRole.BRAND));

// Create a new brief
router.post(
    '/',
    validate(createBriefSchema),
    briefsController.create.bind(briefsController)
);

// Generate brief with AI (rate limited)
router.post(
    '/ai-generate',
    aiLimiter,
    validate(generateBriefSchema),
    briefsController.generateWithAI.bind(briefsController)
);

// Get all briefs for the authenticated brand
router.get(
    '/',
    validate(briefQuerySchema, 'query'),
    briefsController.findAll.bind(briefsController)
);

// Get a single brief
router.get(
    '/:id',
    briefsController.findOne.bind(briefsController)
);

// Update a brief
router.put(
    '/:id',
    validate(updateBriefSchema),
    briefsController.update.bind(briefsController)
);

// Delete a brief
router.delete(
    '/:id',
    briefsController.delete.bind(briefsController)
);

// Publish a draft brief
router.post(
    '/:id/publish',
    briefsController.publish.bind(briefsController)
);

export default router;
