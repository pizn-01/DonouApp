// ====================================
// Authentication Types
// ====================================

export type UserRole = 'brand' | 'manufacturer';

export interface SignupRequest {
    email: string;
    password: string;
    full_name: string;
    role: UserRole;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: UserProfile & { email: string };
    accessToken: string;
    refreshToken: string;
}

export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
    iat?: number;
    exp?: number;
}

export interface RefreshTokenPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

// ====================================
// User Profile Types
// ====================================

export interface UserProfile {
    id: string;
    user_id: string;
    role: UserRole;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
    onboarding_completed: boolean;
    onboarding_completed_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface UserWithDetails extends UserProfile {
    email: string;
    brandProfile?: BrandProfile;
    manufacturerProfile?: ManufacturerProfile;
}

// ====================================
// Brand Profile Types
// ====================================

export interface BrandProfile {
    id: string;
    user_id: string;
    company_name: string;
    industry: string | null;
    company_size: string | null;
    website: string | null;
    description: string | null;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface BrandOnboardingRequest {
    company_name: string;
    industry?: string;
    company_size?: string;
    website?: string;
    description?: string;
    logo_url?: string;
}

// ====================================
// Manufacturer Profile Types
// ====================================

export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'rejected';

export interface Capability {
    category: string;
    subcategories: string[];
}

export interface Certification {
    name: string;
    issued_by?: string;
    expires_at?: string | null;
}

export interface ManufacturerProfile {
    id: string;
    user_id: string;
    company_name: string;
    verification_status: VerificationStatus;
    capabilities: Capability[];
    production_capacity: string | null;
    factory_location: string | null;
    certifications: Certification[];
    year_established: number | null;
    employee_count: string | null;
    website: string | null;
    description: string | null;
    logo_url: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface ManufacturerOnboardingRequest {
    company_name: string;
    capabilities: Capability[];
    production_capacity?: string;
    factory_location?: string;
    certifications?: Certification[];
    year_established?: number;
    employee_count?: string;
    website?: string;
    description?: string;
    logo_url?: string;
}
