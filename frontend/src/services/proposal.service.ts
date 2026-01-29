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
        return response.data.data;
    },

    async getMyProposals() {
        const response = await apiClient.get(`${API_ENDPOINTS.PROPOSALS.BASE}/my-proposals`);
        return response.data.data;
    },

    async getForBrief(briefId: string) {
        const response = await apiClient.get(`${API_ENDPOINTS.BRIEFS.BY_ID(briefId)}/proposals`);
        return response.data.data;
    },

    async updateStatus(id: string, status: string, rejectionReason?: string) {
        const response = await apiClient.patch(
            `${API_ENDPOINTS.PROPOSALS.BY_ID(id)}/status`,
            { status, rejection_reason: rejectionReason }
        );
        return response.data.data;
    }
};
