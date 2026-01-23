import { z } from 'zod';
import { BriefStatus } from '../../types';

// Budget range schema
const budgetSchema = z.object({
    min: z.number().positive('Minimum budget must be positive'),
    max: z.number().positive('Maximum budget must be positive'),
    currency: z.string().default('USD'),
}).refine(data => data.max >= data.min, {
    message: 'Maximum budget must be greater than or equal to minimum',
    path: ['max'],
});

// Requirements schema
const requirementsSchema = z.object({
    productType: z.string().min(2, 'Product type is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    specifications: z.array(z.string()).default([]),
    qualityStandards: z.array(z.string()).optional(),
    packagingRequirements: z.string().optional(),
    additionalNotes: z.string().optional(),
});

// Create brief schema
export const createBriefSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    requirements: requirementsSchema,
    budget: budgetSchema,
    timeline: z.string().min(1, 'Timeline is required'),
    category: z.string().min(2, 'Category is required'),
});

// Update brief schema (all fields optional)
export const updateBriefSchema = z.object({
    title: z.string().min(5).max(200).optional(),
    description: z.string().min(20).optional(),
    requirements: requirementsSchema.partial().optional(),
    budget: budgetSchema.optional(),
    timeline: z.string().optional(),
    category: z.string().optional(),
    status: z.nativeEnum(BriefStatus).optional(),
});

// AI brief generation input
export const generateBriefSchema = z.object({
    productType: z.string().min(2, 'Product type is required'),
    quantity: z.number().int().positive(),
    targetMarket: z.string().optional(),
    budgetRange: z.string().optional(),
    timeline: z.string().optional(),
    additionalDetails: z.string().optional(),
});

// Brief filter/query schema
export const briefQuerySchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    status: z.nativeEnum(BriefStatus).optional(),
    category: z.string().optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports
export type CreateBriefInput = z.infer<typeof createBriefSchema>;
export type UpdateBriefInput = z.infer<typeof updateBriefSchema>;
export type GenerateBriefInput = z.infer<typeof generateBriefSchema>;
export type BriefQuery = z.infer<typeof briefQuerySchema>;
