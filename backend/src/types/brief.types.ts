// =============================================
// Brief Type Definitions
// =============================================

export enum BriefStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    MATCHED = 'matched',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ARCHIVED = 'archived'
}

// =============================================
// Requirements Structure
// =============================================

export interface BriefRequirements {
    productType: string;
    quantity: number;
    specifications: string[];
    qualityStandards?: string[];
    packagingRequirements?: string;
    additionalNotes?: string;
}

// =============================================
// Database Model
// =============================================

export interface Brief {
    id: string;
    brand_id: string;
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget_range_min?: number;
    budget_range_max?: number;
    currency: string;
    timeline: string;
    target_delivery_date?: string;
    status: BriefStatus;
    is_ai_generated: boolean;
    attachments: string[];
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// =============================================
// DTOs (Data Transfer Objects)
// =============================================

export interface BriefCreateDTO {
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget_range_min?: number;
    budget_range_max?: number;
    currency?: string;
    timeline: string;
    target_delivery_date?: string;
    attachments?: string[];
}

export interface BriefUpdateDTO {
    title?: string;
    description?: string;
    requirements?: Partial<BriefRequirements>;
    budget_range_min?: number;
    budget_range_max?: number;
    currency?: string;
    timeline?: string;
    target_delivery_date?: string;
    attachments?: string[];
    status?: BriefStatus;
}

export interface BriefDraftDTO extends BriefCreateDTO {
    is_ai_generated: boolean;
}

// =============================================
// Query Filters
// =============================================

export interface BriefFilters {
    status?: BriefStatus;
    page?: number;
    limit?: number;
    search?: string;
}

// =============================================
// Pagination Response
// =============================================

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// =============================================
// AI Generation
// =============================================

export interface AiGeneratePrompt {
    prompt: string;
}

export interface AiGeneratedBrief {
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget_range_min: number;
    budget_range_max: number;
    currency: string;
    timeline: string;
    category: string;
}
