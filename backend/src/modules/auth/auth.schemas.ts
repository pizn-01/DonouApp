import { z } from 'zod';
import { UserRole } from '../../types';

// Registration schema
export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.nativeEnum(UserRole).default(UserRole.BRAND),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters').optional(),
});

// Login schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

// Password reset request schema
export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Password reset schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

// Update profile schema (Brand)
export const updateBrandProfileSchema = z.object({
    companyName: z.string().min(2).optional(),
    industry: z.string().min(2).optional(),
    description: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    logo: z.string().url().optional().or(z.literal('')),
});

// Update profile schema (Manufacturer)
export const updateManufacturerProfileSchema = z.object({
    businessName: z.string().min(2).optional(),
    capabilities: z.array(z.string()).optional(),
    certifications: z.array(z.string()).optional(),
    productionCapacity: z.string().optional(),
    minimumOrderQuantity: z.number().int().positive().optional(),
    location: z.string().min(2).optional(),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateBrandProfileInput = z.infer<typeof updateBrandProfileSchema>;
export type UpdateManufacturerProfileInput = z.infer<typeof updateManufacturerProfileSchema>;
