import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

export enum BriefStatus {
    DRAFT = 'draft',
    OPEN = 'open',
    MATCHED = 'matched',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    ARCHIVED = 'archived'
}

export interface BriefRequirements {
    productType: string;
    quantity: number;
    specifications: string[];
    qualityStandards?: string[];
    packagingRequirements?: string;
    additionalNotes?: string;
}

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
}

export interface BriefFilters {
    status?: BriefStatus;
    page?: number;
    limit?: number;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

class BriefService {
    async getAll(filters: BriefFilters = {}): Promise<PaginatedResponse<Brief>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);

        const response = await apiClient.get(`${API_ENDPOINTS.BRIEFS.BASE}?${params.toString()}`);
        return response.data;
    }

    async getById(id: string): Promise<Brief> {
        const response = await apiClient.get(API_ENDPOINTS.BRIEFS.BY_ID(id));
        return response.data.data;
    }

    async create(data: Partial<Brief>): Promise<Brief> {
        const response = await apiClient.post(API_ENDPOINTS.BRIEFS.BASE, data);
        return response.data.data;
    }

    async update(id: string, data: Partial<Brief>): Promise<Brief> {
        const response = await apiClient.patch(API_ENDPOINTS.BRIEFS.BY_ID(id), data);
        return response.data.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.BRIEFS.BY_ID(id));
    }

    // Helper to get dashboard stats efficiently
    async getBrandStats() {
        // We use the configured configured endpoint if available, or fallback to the known path
        // Checking config/api.ts again, DASHBOARD.STATS is /dashboard/stats, but user reported /briefs/stats
        // And backend route IS /briefs/stats. So we should use that.
        // It's not in API_ENDPOINTS.BRIEFS explicitly as STATS, so we construct it.
        const response = await apiClient.get(`${API_ENDPOINTS.BRIEFS.BASE}/stats`);
        return response.data.data;
    }
}

export const briefService = new BriefService();
