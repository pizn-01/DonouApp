import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
    private getHeaders() {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async getAll(filters: BriefFilters = {}): Promise<PaginatedResponse<Brief>> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.page) params.append('page', filters.page.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());
        if (filters.search) params.append('search', filters.search);

        const response = await axios.get(`${API_URL}/briefs?${params.toString()}`, {
            headers: this.getHeaders(),
        });
        return response.data;
    }

    async getById(id: string): Promise<Brief> {
        const response = await axios.get(`${API_URL}/briefs/${id}`, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    async create(data: Partial<Brief>): Promise<Brief> {
        const response = await axios.post(`${API_URL}/briefs`, data, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    async update(id: string, data: Partial<Brief>): Promise<Brief> {
        const response = await axios.patch(`${API_URL}/briefs/${id}`, data, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    async delete(id: string): Promise<void> {
        await axios.delete(`${API_URL}/briefs/${id}`, {
            headers: this.getHeaders(),
        });
    }

    // Helper to get dashboard stats efficiently
    async getBrandStats() {
        const response = await axios.get(`${API_URL}/briefs/stats`, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }
}

export const briefService = new BriefService();
