// User roles in the system
export enum UserRole {
    BRAND = 'BRAND',
    MANUFACTURER = 'MANUFACTURER',
    ADMIN = 'ADMIN',
}

// Verification status for manufacturers
export enum VerificationStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    REJECTED = 'REJECTED',
}

// Brief status lifecycle
export enum BriefStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    MATCHING = 'MATCHING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

// Proposal status lifecycle
export enum ProposalStatus {
    PENDING = 'PENDING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    COUNTER_OFFERED = 'COUNTER_OFFERED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

// Match status
export enum MatchStatus {
    SUGGESTED = 'SUGGESTED',
    VIEWED = 'VIEWED',
    CONTACTED = 'CONTACTED',
    DISMISSED = 'DISMISSED',
}

// Notification types
export enum NotificationType {
    NEW_MATCH = 'NEW_MATCH',
    NEW_PROPOSAL = 'NEW_PROPOSAL',
    PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
    PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
    COUNTER_OFFER = 'COUNTER_OFFER',
    NEW_MESSAGE = 'NEW_MESSAGE',
    VERIFICATION_UPDATE = 'VERIFICATION_UPDATE',
    BRIEF_UPDATE = 'BRIEF_UPDATE',
}
