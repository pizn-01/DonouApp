import { supabase } from '../config/database';
import { ProposalCreateDTO, ProposalStatus, ProposalStatusUpdateDTO } from '../types/proposal.types';
import { BriefStatus } from '../types/brief.types';
import { notificationService, NotificationType } from './notification.service';
import { projectService } from './project.service';

export class ProposalService {

    /**
     * Submit a new proposal
     */
    async createProposal(manufacturerId: string, data: ProposalCreateDTO) {
        // 1. Check for existing proposal
        const { data: existing } = await supabase
            .from('proposals')
            .select('id')
            .eq('brief_id', data.brief_id)
            .eq('manufacturer_id', manufacturerId)
            .single();

        if (existing) {
            throw new Error('You have already submitted a proposal for this brief');
        }

        // 2. Validate Brief is Open and Get Brand User ID
        const { data: brief } = await supabase
            .from('briefs')
            .select(`
                status, 
                title,
                brand_profiles!inner(user_id)
            `)
            .eq('id', data.brief_id)
            .single();

        if (!brief || brief.status !== BriefStatus.OPEN) {
            throw new Error('This brief is not accepting proposals');
        }

        // 3. Create Proposal
        const { data: proposal, error } = await supabase
            .from('proposals')
            .insert({
                manufacturer_id: manufacturerId,
                brief_id: data.brief_id,
                price: data.price,
                currency: data.currency || 'USD',
                delivery_timeline: data.delivery_timeline,
                estimated_delivery_date: data.estimated_delivery_date,
                proposal_details: data.proposal_details,
                attachments: data.attachments || [],
                status: ProposalStatus.SUBMITTED,
                submitted_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw new Error(error.message);

        // 4. Notify Brand
        // @ts-ignore
        const brandUserId = brief.brand_profiles?.user_id;
        if (brandUserId) {
            await notificationService.createNotification(
                brandUserId,
                NotificationType.PROPOSAL_RECEIVED,
                'New Proposal Received',
                `You have a new proposal for brief: ${brief.title}`,
                { briefId: data.brief_id, proposalId: proposal.id }
            );
        }

        return proposal;
    }

    /**
     * Get proposals for a specific brief (Brand View)
     */
    async getProposalsForBrief(briefId: string, brandId: string) {
        // Verify ownership
        const { data: brief } = await supabase
            .from('briefs')
            .select('id')
            .eq('id', briefId)
            .eq('brand_id', brandId)
            .single();

        if (!brief) {
            throw new Error('Brief not found or access denied');
        }

        const { data: proposals, error } = await supabase
            .from('proposals')
            .select(`
                *,
                manufacturer_profiles:manufacturer_id(id, company_name, logo_url, verification_status)
            `)
            .eq('brief_id', briefId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);

        // Map manufacturer_profiles to manufacturer for frontend consistency if needed
        return proposals.map((p: any) => ({
            ...p,
            manufacturer: p.manufacturer_profiles
        }));
    }

    /**
     * Get manufacturers own proposals
     */
    async getMyProposals(manufacturerId: string) {
        const { data: proposals, error } = await supabase
            .from('proposals')
            .select(`
                *,
                brief:briefs(id, title, status)
            `)
            .eq('manufacturer_id', manufacturerId)
            .order('created_at', { ascending: false });

        if (error) throw new Error(error.message);
        return proposals;
    }

    /**
     * Update Proposal Status (Brand Action)
     */
    async updateProposalStatus(proposalId: string, brandId: string, updateData: ProposalStatusUpdateDTO) {
        // 1. Fetch Proposal and verify Brief Ownership
        const { data: proposal, error: fetchError } = await supabase
            .from('proposals')
            .select(`
                id, status, brief_id, manufacturer_id,
                manufacturer_profiles!inner(user_id),
                brief:briefs(id, brand_id, status, title)
            `)
            .eq('id', proposalId)
            .single();

        if (fetchError || !proposal) throw new Error('Proposal not found');

        // Check ownership
        const brief = proposal.brief as any;
        if (brief.brand_id !== brandId) {
            throw new Error('Access denied');
        }

        // 2. Validate Transitions
        if (brief.status !== BriefStatus.OPEN && brief.status !== BriefStatus.MATCHED) {
            // throw new Error('Brief is no longer open for changes'); 
        }

        // 3. Update Status
        const { data: updatedProposal, error: updateError } = await supabase
            .from('proposals')
            .update({
                status: updateData.status,
                counter_offer_history: undefined
            })
            .eq('id', proposalId)
            .select()
            .single();

        if (updateError) throw new Error(updateError.message);

        const manufacturerUserId = (proposal as any).manufacturer_profiles?.user_id;

        // 4. Trigger Side Effects
        if (updateData.status === ProposalStatus.ACCEPTED) {
            // A. Update Brief Status to IN_PROGRESS
            await supabase
                .from('briefs')
                .update({
                    status: BriefStatus.IN_PROGRESS // Active Project
                })
                .eq('id', brief.id);

            // B. Create Match Record
            await supabase
                .from('brief_matches')
                .upsert({
                    brief_id: brief.id,
                    manufacturer_id: proposal.manufacturer_id,
                    match_type: 'manual_selection',
                    match_score: 100
                }, { onConflict: 'brief_id,manufacturer_id' });

            // C. Create Initial Project Update (Milestone)
            await projectService.createUpdate(
                brief.id,
                manufacturerUserId, // Author? Or Brand? Let's say Manufacturer starts it, or System.
                // Actually author_id refers to auth users. We don't have system user easily.
                // Let's use the Brand Owner (current user) as author of the 'Project Started' update.
                // But wait, createUpdate takes authorId.
                // We'll use the Brand (who accepted it).
                // Or just use the manufacturer ID since they are the ones doing the work.
                manufacturerUserId || '',
                "Project started! Proposal accepted.",
                "MILESTONE"
            );

            // D. Notify Manufacturer
            if (manufacturerUserId) {
                await notificationService.createNotification(
                    manufacturerUserId,
                    NotificationType.PROPOSAL_ACCEPTED,
                    'Proposal Accepted!',
                    `Your proposal for "${brief.title}" has been accepted. Project is now Active.`,
                    { briefId: brief.id, proposalId: proposal.id }
                );
            }

        } else if (updateData.status === ProposalStatus.REJECTED) {
            // Notify Manufacturer
            if (manufacturerUserId) {
                await notificationService.createNotification(
                    manufacturerUserId,
                    NotificationType.PROPOSAL_REJECTED,
                    'Proposal Update',
                    `Your proposal for "${brief.title}" was not selected.`,
                    { briefId: brief.id }
                );
            }
        }

        return updatedProposal;
    }
}
