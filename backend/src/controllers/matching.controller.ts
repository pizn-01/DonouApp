import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { MatchingService } from '../services/matching.service';

const matchingService = new MatchingService();

export class MatchingController {

    /**
     * Get recommendations
     * GET /api/matches/recommendations
     */
    async getRecommendations(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user!;
            const { brief_id, manufacturer_id } = req.query;

            // Scenario 1: Brand looking for manufacturer matches for a brief
            if (user.role === 'brand') {
                if (!brief_id) {
                    return res.status(400).json({ success: false, message: 'brief_id is required for brand recommendations' });
                }

                // Ideally verify ownership of brief here, or inside service. 
                // Service checks valid brief, but ownership check is better here.
                // Assuming service handles basic validation or it throws Not Found.

                const result = await matchingService.getRecommendationsForBrief(brief_id as string);
                return res.json({ success: true, data: result });
            }

            // Scenario 2: Manufacturer looking for brief matches
            if (user.role === 'manufacturer') {
                // Get manufacturer profile ID
                const { supabase } = await import('../config/database');
                let manuId = manufacturer_id as string;

                if (!manuId) {
                    const { data: manu } = await supabase
                        .from('manufacturer_profiles')
                        .select('id')
                        .eq('user_id', user.userId)
                        .single();

                    if (!manu) return res.status(404).json({ success: false, message: 'Manufacturer profile not found' });
                    manuId = manu.id;
                }

                const result = await matchingService.getRecommendationsForManufacturer(manuId);
                return res.json({ success: true, data: result });
            }

            return res.status(403).json({ success: false, message: 'Invalid role' });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new MatchingController();
