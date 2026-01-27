import { supabase } from '../config/database';
import { ManufacturerMatch, RecommendationResponse } from '../types/matching.types';

export class MatchingService {
    /**
     * Get manufacturer recommendations for a specific brief
     * Logic: Match Brief Category -> Manufacturer Capabilities
     */
    async getRecommendationsForBrief(briefId: string): Promise<RecommendationResponse> {
        // 1. Fetch the brief to get its requirements
        const { data: brief, error: briefError } = await supabase
            .from('briefs')
            .select('*')
            .eq('id', briefId)
            .single();

        if (briefError || !brief) {
            throw new Error('Brief not found');
        }

        // Extract category/industry from requirements
        // Assuming requirements structure: { "category": "Apparel", ... }
        const requirements = brief.requirements as any;
        // const targetCategory = requirements.category || brief.title;

        // 2. Query Manufacturers
        // Rule: Must be verified AND have matching capability
        let query = supabase
            .from('manufacturer_profiles')
            .select('*')
            .eq('verification_status', 'verified');

        if (requirements.category) {
            // Check if capabilities array contains an object with this category
            // capabilities: [{"category": "Apparel"}]
            query = query.contains('capabilities', [{ category: requirements.category }]);
        }

        const { data: manufacturers, error: manuError } = await query;

        if (manuError) {
            throw new Error(`Failed to fetch manufacturers: ${manuError.message}`);
        }

        // 3. Map to ManufacturerMatch interface
        const matches: ManufacturerMatch[] = (manufacturers || []).map((manu: any) => ({
            manufacturer_id: manu.id,
            company_name: manu.company_name,
            match_score: requirements.category ? 100 : 50, // 100% if category match, 50% if general
            match_reasons: requirements.category ? [`Matches category: ${requirements.category}`] : ['Verified Manufacturer'],
            verification_status: manu.verification_status,
            profile_data: {
                location: manu.factory_location,
                min_order: manu.min_order_quantity || 'N/A' // Assuming column or json field
            }
        }));

        return {
            matches,
            count: matches.length
        };
    }

    /**
     * Get brief recommendations for a manufacturer
     * Logic: Match Manufacturer Capabilities -> Brief Requirements
     */
    async getRecommendationsForManufacturer(manufacturerId: string): Promise<RecommendationResponse> {
        // 1. Get Manufacturer Profile
        const { data: manu, error: manuError } = await supabase
            .from('manufacturer_profiles')
            .select('capabilities')
            .eq('id', manufacturerId)
            .single();

        if (manuError || !manu) {
            throw new Error('Manufacturer profile not found');
        }

        const capabilities = manu.capabilities as any[]; // [{"category": "Apparel"}]
        const categories = capabilities.map(c => c.category).filter(Boolean);

        if (categories.length === 0) {
            return { matches: [], count: 0 };
        }

        // 2. Query Open Briefs
        // Logic: Brief requirements.category IN manufacturer categories
        // Supabase doesn't have a simple "JSON value inside Array" filter for the reverse easily without RPC?
        // Actually, we can fetch 'open' briefs and filter in application for MVP if volume is low.
        // OR use text search if stored as text.

        // MVP: Fetch open briefs, filter in code.
        const { data: briefs, error: briefError } = await supabase
            .from('briefs')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false })
            .limit(50); // MVP limit

        if (briefError) throw new Error(briefError.message);

        const matchedBriefs = (briefs || []).filter((brief: any) => {
            const reqCategory = brief.requirements?.category;
            return categories.includes(reqCategory);
        });

        const matches = matchedBriefs.map((brief: any) => ({
            brief_id: brief.id,
            title: brief.title,
            match_score: 100,
            match_reasons: [`Matches capability: ${brief.requirements?.category}`],
            status: brief.status,
            brief_data: brief
        }));

        return {
            matches: matches,
            count: matches.length
        };
    }
}
