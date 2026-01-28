import { supabase } from '../config/database';
import {
    BrandProfile,
    ManufacturerProfile,
    BrandOnboardingRequest,
    ManufacturerOnboardingRequest,
    UserRole,
} from '../types/auth.types';

export class OnboardingService {
    /**
     * Complete brand onboarding
     */
    async completeBrandOnboarding(
        userId: string,
        data: BrandOnboardingRequest
    ): Promise<BrandProfile> {
        // Verify user is a brand
        const { data: userProfile, error: userError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (userError || !userProfile) {
            throw new Error('User not found');
        }

        if (userProfile.role !== 'brand') {
            throw new Error('Only brand users can complete brand onboarding');
        }

        // Check if brand profile already exists
        const { data: existingProfile } = await supabase
            .from('brand_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingProfile) {
            // Update existing profile
            const { data: updatedProfile, error: updateError } = await supabase
                .from('brand_profiles')
                .update({
                    company_name: data.company_name,
                    industry: data.industry || null,
                    company_size: data.company_size || null,
                    website: data.website || null,
                    description: data.description || null,
                    logo_url: data.logo_url || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError || !updatedProfile) {
                throw new Error('Failed to update brand profile');
            }
        } else {
            // Create new brand profile
            const { data: newProfile, error: insertError } = await supabase
                .from('brand_profiles')
                .insert({
                    user_id: userId,
                    company_name: data.company_name,
                    industry: data.industry || null,
                    company_size: data.company_size || null,
                    website: data.website || null,
                    description: data.description || null,
                    logo_url: data.logo_url || null,
                })
                .select()
                .single();

            if (insertError || !newProfile) {
                throw new Error('Failed to create brand profile');
            }
        }

        // Mark user onboarding as completed
        const { error: updateOnboardingError } = await supabase
            .from('user_profiles')
            .update({
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (updateOnboardingError) {
            throw new Error('Failed to mark onboarding as completed');
        }

        // Fetch and return the updated brand profile
        const { data: finalProfile, error: fetchError } = await supabase
            .from('brand_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError || !finalProfile) {
            throw new Error('Failed to retrieve brand profile');
        }

        return finalProfile as BrandProfile;
    }

    /**
     * Complete manufacturer onboarding
     */
    async completeManufacturerOnboarding(
        userId: string,
        data: ManufacturerOnboardingRequest
    ): Promise<ManufacturerProfile> {
        // Verify user is a manufacturer
        const { data: userProfile, error: userError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', userId)
            .single();

        if (userError || !userProfile) {
            throw new Error('User not found');
        }

        if (userProfile.role !== 'manufacturer') {
            throw new Error('Only manufacturer users can complete manufacturer onboarding');
        }

        // Check if manufacturer profile already exists
        const { data: existingProfile } = await supabase
            .from('manufacturer_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existingProfile) {
            // Update existing profile
            const { data: updatedProfile, error: updateError } = await supabase
                .from('manufacturer_profiles')
                .update({
                    company_name: data.company_name,
                    capabilities: data.capabilities,
                    production_capacity: data.production_capacity || null,
                    factory_location: data.factory_location || null,
                    certifications: data.certifications || [],
                    year_established: data.year_established || null,
                    employee_count: data.employee_count || null,
                    website: data.website || null,
                    description: data.description || null,
                    logo_url: data.logo_url || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('user_id', userId)
                .select()
                .single();

            if (updateError || !updatedProfile) {
                throw new Error('Failed to update manufacturer profile');
            }
        } else {
            // Create new manufacturer profile (verification_status defaults to 'pending' in DB)
            const { error: insertError } = await supabase
                .from('manufacturer_profiles')
                .insert({
                    user_id: userId,
                    company_name: data.company_name,
                    capabilities: data.capabilities,
                    production_capacity: data.production_capacity || null,
                    factory_location: data.factory_location || null,
                    certifications: data.certifications || [],
                    year_established: data.year_established || null,
                    employee_count: data.employee_count || null,
                    website: data.website || null,
                    description: data.description || null,
                    logo_url: data.logo_url || null,
                });

            if (insertError) {
                throw new Error('Failed to create manufacturer profile');
            }
        }

        // Mark user onboarding as completed
        const { error: updateOnboardingError } = await supabase
            .from('user_profiles')
            .update({
                onboarding_completed: true,
                onboarding_completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

        if (updateOnboardingError) {
            throw new Error('Failed to mark onboarding as completed');
        }

        // Fetch and return the updated manufacturer profile
        const { data: finalProfile, error: fetchError } = await supabase
            .from('manufacturer_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (fetchError || !finalProfile) {
            throw new Error('Failed to retrieve manufacturer profile');
        }

        return finalProfile as ManufacturerProfile;
    }

    /**
     * Get onboarding status for a user
     */
    async getOnboardingStatus(userId: string, role: UserRole): Promise<{
        isOnboarded: boolean;
        profile: BrandProfile | ManufacturerProfile | null;
    }> {
        if (role === 'brand') {
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            return {
                isOnboarded: !!brandProfile,
                profile: brandProfile || null,
            };
        } else {
            const { data: manufacturerProfile } = await supabase
                .from('manufacturer_profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            return {
                isOnboarded: !!manufacturerProfile,
                profile: manufacturerProfile || null,
            };
        }
    }
}

export default new OnboardingService();
