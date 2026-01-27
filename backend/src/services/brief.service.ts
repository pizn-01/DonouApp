import { supabase } from '../config/database';
import {
    Brief,
    BriefCreateDTO,
    BriefUpdateDTO,
    BriefFilters,
    PaginatedResponse,
    BriefStatus
} from '../types/brief.types';
import { UserRole } from '../types/auth.types';

// =============================================
// Brief Service
// =============================================

export class BriefService {

    /**
     * Create a new brief
     */
    async createBrief(brandId: string, data: BriefCreateDTO): Promise<Brief> {
        const { data: brief, error } = await supabase
            .from('briefs')
            .insert({
                brand_id: brandId,
                title: data.title,
                description: data.description,
                requirements: data.requirements,
                budget_range_min: data.budget_range_min,
                budget_range_max: data.budget_range_max,
                currency: data.currency || 'USD',
                timeline: data.timeline,
                target_delivery_date: data.target_delivery_date,
                attachments: data.attachments || [],
                status: BriefStatus.DRAFT,
                is_ai_generated: false
            })
            .select(`
        *,
        brand_profiles:brand_id (
          id,
          company_name,
          logo_url
        )
      `)
            .single();

        if (error) {
            throw new Error(`Failed to create brief: ${error.message}`);
        }

        return brief;
    }

    /**
     * Get briefs with role-based filtering
     */
    async getBriefs(
        userId: string,
        role: UserRole,
        filters: BriefFilters
    ): Promise<PaginatedResponse<Brief>> {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        // Build base query
        let query = supabase
            .from('briefs')
            .select(`
        *,
        brand_profiles:brand_id (
          id,
          company_name,
          logo_url
        )
      `, { count: 'exact' })
            .is('deleted_at', null);

        // Role-based filtering
        if (role === 'brand') {
            // Brands see only their own briefs
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (!brandProfile) {
                throw new Error('Brand profile not found');
            }

            query = query.eq('brand_id', brandProfile.id);
        } else if (role === 'manufacturer') {
            // Manufacturers see only open briefs
            query = query.eq('status', BriefStatus.OPEN);
        }

        // Apply status filter
        if (filters.status) {
            query = query.eq('status', filters.status);
        }

        // Apply search filter
        if (filters.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Pagination and ordering
        query = query
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data: briefs, error, count } = await query;

        if (error) {
            throw new Error(`Failed to fetch briefs: ${error.message}`);
        }

        return {
            data: briefs || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    }

    /**
     * Get a single brief by ID with access control
     */
    async getBriefById(id: string, userId: string, role: UserRole): Promise<Brief> {
        const { data: brief, error } = await supabase
            .from('briefs')
            .select(`
        *,
        brand_profiles:brand_id (
          id,
          user_id,
          company_name,
          logo_url,
          industry,
          website
        )
      `)
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (error || !brief) {
            throw new Error('Brief not found');
        }

        // Access control
        if (role === 'brand') {
            // Brands can only see their own briefs
            if (brief.brand_profiles?.user_id !== userId) {
                throw new Error('Access denied');
            }
        } else if (role === 'manufacturer') {
            // Manufacturers can only see open briefs
            if (brief.status !== BriefStatus.OPEN) {
                throw new Error('Brief not available');
            }
        }

        return brief;
    }

    /**
     * Update a brief (Brand only, status restrictions apply)
     */
    async updateBrief(
        id: string,
        brandId: string,
        data: BriefUpdateDTO
    ): Promise<Brief> {
        // First, verify ownership and get current status
        const { data: existingBrief, error: fetchError } = await supabase
            .from('briefs')
            .select('status, brand_id')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (fetchError || !existingBrief) {
            throw new Error('Brief not found');
        }

        if (existingBrief.brand_id !== brandId) {
            throw new Error('Access denied');
        }

        // Status restrictions: can only modify draft or open briefs
        const allowedStatuses = [BriefStatus.DRAFT, BriefStatus.OPEN];
        if (!allowedStatuses.includes(existingBrief.status as BriefStatus)) {
            throw new Error('Cannot modify brief in current status');
        }

        // Perform update
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        // Only include fields that are provided
        if (data.title !== undefined) updateData.title = data.title;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.requirements !== undefined) {
            // Merge requirements if partial update
            if (existingBrief.status === BriefStatus.DRAFT) {
                const { data: currentBrief } = await supabase
                    .from('briefs')
                    .select('requirements')
                    .eq('id', id)
                    .single();

                updateData.requirements = {
                    ...currentBrief?.requirements,
                    ...data.requirements
                };
            } else {
                updateData.requirements = data.requirements;
            }
        }
        if (data.budget_range_min !== undefined) updateData.budget_range_min = data.budget_range_min;
        if (data.budget_range_max !== undefined) updateData.budget_range_max = data.budget_range_max;
        if (data.currency !== undefined) updateData.currency = data.currency;
        if (data.timeline !== undefined) updateData.timeline = data.timeline;
        if (data.target_delivery_date !== undefined) updateData.target_delivery_date = data.target_delivery_date;
        if (data.attachments !== undefined) updateData.attachments = data.attachments;
        if (data.status !== undefined) updateData.status = data.status;

        const { data: updatedBrief, error: updateError } = await supabase
            .from('briefs')
            .update(updateData)
            .eq('id', id)
            .select(`
        *,
        brand_profiles:brand_id (
          id,
          company_name,
          logo_url
        )
      `)
            .single();

        if (updateError) {
            throw new Error(`Failed to update brief: ${updateError.message}`);
        }

        return updatedBrief;
    }

    /**
     * Delete a brief (soft delete, draft only)
     */
    async deleteBrief(id: string, brandId: string): Promise<void> {
        // Verify ownership and status
        const { data: existingBrief, error: fetchError } = await supabase
            .from('briefs')
            .select('status, brand_id')
            .eq('id', id)
            .is('deleted_at', null)
            .single();

        if (fetchError || !existingBrief) {
            throw new Error('Brief not found');
        }

        if (existingBrief.brand_id !== brandId) {
            throw new Error('Access denied');
        }

        // Only drafts can be deleted
        if (existingBrief.status !== BriefStatus.DRAFT) {
            throw new Error('Only draft briefs can be deleted');
        }

        // Soft delete
        const { error: deleteError } = await supabase
            .from('briefs')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (deleteError) {
            throw new Error(`Failed to delete brief: ${deleteError.message}`);
        }
    }

    /**
     * Create brief from AI generation
     */
    async createAiBrief(brandId: string, data: BriefCreateDTO): Promise<Brief> {
        const { data: brief, error } = await supabase
            .from('briefs')
            .insert({
                brand_id: brandId,
                title: data.title,
                description: data.description,
                requirements: data.requirements,
                budget_range_min: data.budget_range_min,
                budget_range_max: data.budget_range_max,
                currency: data.currency || 'USD',
                timeline: data.timeline,
                target_delivery_date: data.target_delivery_date,
                attachments: data.attachments || [],
                status: BriefStatus.DRAFT,
                is_ai_generated: true
            })
            .select(`
        *,
        brand_profiles:brand_id (
          id,
          company_name,
          logo_url
        )
      `)
            .single();

        if (error) {
            throw new Error(`Failed to create AI brief: ${error.message}`);
        }

        return brief;
    }

    /**
     * Get dashboard stats for a brand
     */
    async getBrandStats(brandId: string) {
        // 1. Get Brief Counts by Status
        const { data: briefs, error: briefError } = await supabase
            .from('briefs')
            .select('id, status')
            .eq('brand_id', brandId)
            .is('deleted_at', null);

        if (briefError) throw new Error(`Failed to fetch brief stats: ${briefError.message}`);

        const totalBriefs = briefs.length;
        const activeBriefs = briefs.filter(b => b.status === BriefStatus.OPEN).length;
        const briefIds = briefs.map(b => b.id);

        if (briefIds.length === 0) {
            return {
                totalBriefs: 0,
                activeBriefs: 0,
                pendingProposals: 0,
                acceptedProposals: 0
            };
        }

        // 2. Get Proposal Counts (Pending and Accepted) linked to these briefs
        const { data: proposals, error: proposalError } = await supabase
            .from('proposals')
            .select('status')
            .in('brief_id', briefIds);

        if (proposalError) throw new Error(`Failed to fetch proposal stats: ${proposalError.message}`);

        const pendingProposals = proposals.filter(p => p.status === 'SUBMITTED').length;
        const acceptedProposals = proposals.filter(p => p.status === 'ACCEPTED').length;

        return {
            totalBriefs,
            activeBriefs,
            pendingProposals,
            acceptedProposals
        };
    }
}
