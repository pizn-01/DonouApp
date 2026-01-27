import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { ProposalService } from '../services/proposal.service';
import { ProposalCreateDTO, ProposalStatusUpdateDTO } from '../types/proposal.types';

const proposalService = new ProposalService();

export class ProposalController {

    /**
     * Submit a proposal (Manufacturer only)
     * POST /api/proposals
     */
    async create(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user!;
            // Get manufacturer profile ID
            // Ideally should be in req.user or middleware, but querying here for MVP safety
            const { supabase } = await import('../config/database');
            const { data: manu } = await supabase
                .from('manufacturer_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!manu) {
                return res.status(403).json({ success: false, message: 'Manufacturer profile required' });
            }

            const dto: ProposalCreateDTO = req.body;
            const proposal = await proposalService.createProposal(manu.id, dto);

            return res.status(201).json({ success: true, data: proposal });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Get proposals for a brief (Brand only)
     * GET /api/briefs/:id/proposals
     */
    async getForBrief(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user!;
            const { id: briefId } = req.params;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brand } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!brand) return res.status(403).json({ success: false, message: 'Brand access required' });

            const proposals = await proposalService.getProposalsForBrief(briefId, brand.id);
            return res.json({ success: true, data: proposals });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get my proposals (Manufacturer only)
     * GET /api/proposals/my-proposals
     */
    async getMyProposals(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user!;
            const { supabase } = await import('../config/database');
            const { data: manu } = await supabase
                .from('manufacturer_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!manu) return res.status(403).json({ success: false, message: 'Manufacturer access required' });

            const proposals = await proposalService.getMyProposals(manu.id);
            return res.json({ success: true, data: proposals });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Update Proposal Status (Brand Only)
     * PATCH /api/proposals/:id/status
     */
    async updateStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const user = req.user!;
            const { id } = req.params;
            const dto: ProposalStatusUpdateDTO = req.body;

            const { supabase } = await import('../config/database');
            const { data: brand } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!brand) return res.status(403).json({ success: false, message: 'Brand access required' });

            const updated = await proposalService.updateProposalStatus(id, brand.id, dto);
            return res.json({ success: true, data: updated });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new ProposalController();
