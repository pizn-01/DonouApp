import { apiClient } from '@/lib/apiClient';
// import { API_ENDPOINTS } from '@/config/api'; // Not strictly needed if using relative paths or verified

export interface MatchRecommendation {
    manufacturer_id?: string;
    brief_id?: string;
    match_score: number;
    match_reasons: string[];
    [key: string]: any;
}

export const matchingService = {
    async getRecommendations(params: { brief_id?: string; manufacturer_id?: string }) {
        const queryParams = new URLSearchParams();
        if (params.brief_id) queryParams.append('brief_id', params.brief_id);
        if (params.manufacturer_id) queryParams.append('manufacturer_id', params.manufacturer_id);

        const response = await apiClient.get(`/matches/recommendations?${queryParams.toString()}`);
        return response.data;
    }
};
