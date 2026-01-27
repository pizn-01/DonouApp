export enum ProposalStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    UNDER_REVIEW = 'under_review',
    ACCEPTED = 'accepted',
    REJECTED = 'rejected',
    COUNTER_OFFER = 'counter_offer'
}

export interface Proposal {
    id: string;
    brief_id: string;
    manufacturer_id: string;
    price: number;
    currency: string;
    delivery_timeline: string;
    estimated_delivery_date?: string;
    proposal_details: Record<string, any>; // JSONB
    status: ProposalStatus;
    attachments: string[];
    counter_offer_history: any[];
    submitted_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ProposalCreateDTO {
    brief_id: string;
    price: number;
    currency?: string;
    delivery_timeline: string;
    estimated_delivery_date?: string;
    proposal_details: Record<string, any>;
    attachments?: string[];
}

export interface ProposalUpdateDTO {
    price?: number;
    currency?: string;
    delivery_timeline?: string;
    estimated_delivery_date?: string;
    proposal_details?: Record<string, any>;
    status?: ProposalStatus;
    attachments?: string[];
}

export interface ProposalStatusUpdateDTO {
    status: ProposalStatus;
    rejection_reason?: string; // Optional metadata for rejection
}
