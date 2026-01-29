import { z } from 'zod';

// =============================================
// Requirements Schema
// =============================================

const requirementsSchema = z.object({
    productType: z.string().trim().min(2).max(200),
    quantity: z.number().int().min(1),
    specifications: z.array(z.string().trim()).min(1),
    qualityStandards: z.array(z.string().trim()).optional(),
    packagingRequirements: z.string().trim().max(500).optional(),
    additionalNotes: z.string().trim().max(2000).optional()
});

// =============================================
// Create Brief Validation
// =============================================

export const validateBriefCreate = z.object({
    title: z.string().trim().min(5).max(500),
    description: z.string().trim().min(20).max(5000),
    requirements: requirementsSchema,
    budget_range_min: z.number().min(0).optional(),
    budget_range_max: z.number().min(0).optional(),
    currency: z.string().length(3).toUpperCase().default('USD'),
    timeline: z.string().trim().min(2).max(255),
    target_delivery_date: z.string().datetime().optional(),
    attachments: z.array(z.string().url()).max(10).optional()
}).refine((data) => {
    // Custom validation: if min budget is set, max should be set too and be greater
    if (data.budget_range_min !== undefined && data.budget_range_max === undefined) {
        return false;
    }
    if (data.budget_range_min !== undefined && data.budget_range_max !== undefined) {
        return data.budget_range_max >= data.budget_range_min;
    }
    return true;
}, {
    message: 'Budget range is incomplete or invalid',
});

// =============================================
// Update Brief Validation
// =============================================

export const validateBriefUpdate = z.object({
    title: z.string().trim().min(5).max(500).optional(),
    description: z.string().trim().min(20).max(5000).optional(),
    requirements: z.object({
        productType: z.string().trim().min(2).max(200).optional(),
        quantity: z.number().int().min(1).optional(),
        specifications: z.array(z.string().trim()).min(1).optional(),
        qualityStandards: z.array(z.string().trim()).optional(),
        packagingRequirements: z.string().trim().max(500).optional(),
        additionalNotes: z.string().trim().max(2000).optional()
    }).optional(),
    budget_range_min: z.number().min(0).optional(),
    budget_range_max: z.number().min(0).optional(),
    currency: z.string().length(3).toUpperCase().optional(),
    timeline: z.string().trim().min(2).max(255).optional(),
    target_delivery_date: z.string().datetime().optional(),
    attachments: z.array(z.string().url()).max(10).optional(),
    status: z.enum(['draft', 'open', 'archived']).optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be present'
});

// =============================================
// AI Prompt Validation
// =============================================

export const validateAiPrompt = z.object({
    prompt: z.string().trim().min(10).max(2000)
});

// =============================================
// Query Filters Validation
// =============================================

export const validateBriefFilters = z.object({
    status: z.enum(['draft', 'open', 'matched', 'in_progress', 'completed', 'archived']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().trim().max(200).optional()
});
