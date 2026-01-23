export enum BriefStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface BriefRequirements {
    productType: string;
    quantity: number;
    specifications: string[];
    qualityStandards?: string[];
    packagingRequirements?: string;
    additionalNotes?: string;
}

export interface BriefBudget {
    min: number;
    max: number;
    currency: string;
}

export interface Brief {
    id: string;
    brandId: string;
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget: BriefBudget;
    timeline: string;
    category: string;
    status: BriefStatus;
    aiGenerated: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBriefInput {
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget: BriefBudget;
    timeline: string;
    category: string;
}

export interface GenerateBriefInput {
    productType: string;
    quantity: number;
    targetMarket?: string;
    budgetRange?: string;
    timeline?: string;
    additionalDetails?: string;
}
