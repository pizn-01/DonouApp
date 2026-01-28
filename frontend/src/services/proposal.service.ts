import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';

export interface ProposalDTO {
    brief_id: string;
    price: number;
    delivery_timeline: string;
    proposal_details: any;
    attachments: string[];
}

export const proposalService = {
    async create(data: ProposalDTO) {
        const response = await apiClient.post(API_ENDPOINTS.PROPOSALS.BASE, data);
        return response.data;
    },

    async getMyProposals() {
        const response = await apiClient.get(`${API_ENDPOINTS.PROPOSALS.BASE}/my-proposals`);
        return response.data;
    },

    async getForBrief(briefId: string) {
        // API_ENDPOINTS.PROPOSALS doesn't have BY_BRIEF usually, checking api.ts...
        // api.ts: PROPOSALS: { BASE: ..., BY_ID: ... }
        // The backend route is /api/briefs/:id/proposals usually?
        // Let's check proposal.controller/routes or just use the old URL logic relative to base.
        // Old logic: `${API_URL}/briefs/${briefId}/proposals`
        const response = await apiClient.get(`${API_ENDPOINTS.BRIEFS.BY_ID(briefId)}/proposals`);
        return response.data;
    },

    async updateStatus(id: string, status: string, rejectionReason?: string) {
        const response = await apiClient.patch(
            `${API_ENDPOINTS.PROPOSALS.BY_ID(id)}/status`,
            { status, rejection_reason: rejectionReason }
        );
        return response.data;
    }
};
