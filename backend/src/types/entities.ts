import { UserRole, VerificationStatus, BriefStatus, ProposalStatus, MatchStatus } from './enums';

// Base user interface
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    onboardingCompleted: boolean;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Brand profile
export interface BrandProfile {
    id: string;
    userId: string;
    companyName: string;
    industry: string;
    description?: string;
    website?: string;
    logo?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Manufacturer profile
export interface ManufacturerProfile {
    id: string;
    userId: string;
    businessName: string;
    capabilities: string[];
    certifications: string[];
    productionCapacity?: string;
    minimumOrderQuantity?: number;
    location: string;
    verificationStatus: VerificationStatus;
    verificationDocuments?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Brief (project request from brand)
export interface Brief {
    id: string;
    brandId: string;
    title: string;
    description: string;
    requirements: BriefRequirements;
    budget: BudgetRange;
    timeline: string;
    category: string;
    status: BriefStatus;
    aiGenerated: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BriefRequirements {
    productType: string;
    quantity: number;
    specifications: string[];
    qualityStandards?: string[];
    packagingRequirements?: string;
    additionalNotes?: string;
}

export interface BudgetRange {
    min: number;
    max: number;
    currency: string;
}

// Proposal from manufacturer
export interface Proposal {
    id: string;
    briefId: string;
    manufacturerId: string;
    content: string;
    pricing: ProposalPricing;
    timeline: string;
    status: ProposalStatus;
    counterOfferHistory: CounterOffer[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ProposalPricing {
    unitPrice: number;
    totalPrice: number;
    currency: string;
    breakdown?: PriceBreakdown[];
}

export interface PriceBreakdown {
    item: string;
    amount: number;
}

export interface CounterOffer {
    fromBrand: boolean;
    pricing?: ProposalPricing;
    timeline?: string;
    message: string;
    createdAt: Date;
}

// Match between brief and manufacturer
export interface Match {
    id: string;
    briefId: string;
    manufacturerId: string;
    score: number;
    matchReasons: string[];
    status: MatchStatus;
    createdAt: Date;
}

// Conversation (message thread)
export interface Conversation {
    id: string;
    participants: string[];
    briefId?: string;
    lastMessageAt: Date;
    createdAt: Date;
}

// Message
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    aiGenerated: boolean;
    readBy: string[];
    createdAt: Date;
}

// Notification
export interface Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    content: string;
    read: boolean;
    data?: Record<string, unknown>;
    createdAt: Date;
}
