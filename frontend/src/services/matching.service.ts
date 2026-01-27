import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface MatchRecommendation {
    manufacturer_id?: string;
    brief_id?: string;
    match_score: number;
    match_reasons: string[];
    [key: string]: any;
}

export const matchingService = {
    async getRecommendations(params: { brief_id?: string; manufacturer_id?: string }) {
        const token = localStorage.getItem('token');
        const queryParams = new URLSearchParams();
        if (params.brief_id) queryParams.append('brief_id', params.brief_id);
        if (params.manufacturer_id) queryParams.append('manufacturer_id', params.manufacturer_id);

        const response = await axios.get(`${API_URL}/matches/recommendations?${queryParams.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};
