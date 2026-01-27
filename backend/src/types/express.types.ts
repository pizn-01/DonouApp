import { Request } from 'express';
import { UserProfile, UserRole } from './auth.types';

// Extend Express Request to include authenticated user
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        userId: string;
        email: string;
        role: UserRole;
        profile: UserProfile;
    };
}
