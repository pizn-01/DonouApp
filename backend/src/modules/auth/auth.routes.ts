import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware';
import { authenticate, authLimiter } from '../../middleware';
import {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    updateBrandProfileSchema,
    updateManufacturerProfileSchema,
} from './auth.schemas';

const router = Router();

// Public routes (with rate limiting)
router.post(
    '/register',
    authLimiter,
    validate(registerSchema),
    authController.register.bind(authController)
);

router.post(
    '/login',
    authLimiter,
    validate(loginSchema),
    authController.login.bind(authController)
);

router.post(
    '/forgot-password',
    authLimiter,
    validate(forgotPasswordSchema),
    authController.forgotPassword.bind(authController)
);

router.post(
    '/refresh',
    authLimiter,
    authController.refresh.bind(authController)
);

// Protected routes
router.post(
    '/logout',
    authenticate,
    authController.logout.bind(authController)
);

router.get(
    '/me',
    authenticate,
    authController.getProfile.bind(authController)
);

router.put(
    '/profile',
    authenticate,
    authController.updateProfile.bind(authController)
);

export default router;
