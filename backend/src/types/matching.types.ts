import { Brief } from './brief.types';

export interface MatchingCriteria {
    industry?: string;
    category?: string;
    verification_status?: string;
}

export interface ManufacturerMatch {
    manufacturer_id: string;
    company_name: string;
    match_score: number;
    match_reasons: string[];
    verification_status: string;
    profile_data: any; // Simplified profile preview
}

export interface BriefMatch {
    brief_id: string;
    title: string;
    match_score: number;
    match_reasons: string[];
    status: string;
    brief_data: Brief;
}

export interface RecommendationResponse {
    matches: ManufacturerMatch[] | BriefMatch[];
    count: number;
}
