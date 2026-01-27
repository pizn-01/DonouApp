import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface ProposalDTO {
    brief_id: string;
    price: number;
    delivery_timeline: string;
    proposal_details: any;
    attachments: string[];
}

export const proposalService = {
    async create(data: ProposalDTO) {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/proposals`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getMyProposals() {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/proposals/my-proposals`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    async getForBrief(briefId: string) {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/briefs/${briefId}/proposals`, {
            headers: { Authorization: `Bearer ${token}` } // Only Brand can access this usually
        });
        return response.data;
    },

    async updateStatus(id: string, status: string, rejectionReason?: string) {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${API_URL}/proposals/${id}/status`, { status, rejection_reason: rejectionReason }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
