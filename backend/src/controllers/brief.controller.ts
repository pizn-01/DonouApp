import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { BriefService } from '../services/brief.service';
import {
    validateBriefCreate,
    validateBriefUpdate,
    validateBriefFilters
} from '../validators/brief.validator';
import { BriefCreateDTO, BriefUpdateDTO, BriefFilters } from '../types/brief.types';

const briefService = new BriefService();

// =============================================
// Brief Controller
// =============================================

export class BriefController {
    /**
     * Create a new brief
     * POST /api/briefs
     */
    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // Validate request body
            const { error, value } = validateBriefCreate.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
                return;
            }

            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!brandProfile) {
                res.status(404).json({
                    success: false,
                    message: 'Brand profile not found. Please complete onboarding first.'
                });
                return;
            }

            const briefData: BriefCreateDTO = value;
            const brief = await briefService.createBrief(brandProfile.id, briefData);

            res.status(201).json({
                success: true,
                message: 'Brief created successfully',
                data: brief
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to create brief'
            });
        }
    }

    /**
     * Get all briefs (with role-based filtering)
     * GET /api/briefs
     */
    async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // Validate query parameters
            const { error, value } = validateBriefFilters.validate(req.query);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
                return;
            }

            const user = req.user!;
            const filters: BriefFilters = value;

            const result = await briefService.getBriefs(user.id, user.role, filters);

            res.json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch briefs'
            });
        }
    }

    /**
     * Get dashboard statistics
     * GET /api/briefs/stats
     */
    async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            // If no brand profile exists yet, return empty stats
            if (!brandProfile) {
                res.json({
                    success: true,
                    data: {
                        totalBriefs: 0,
                        activeBriefs: 0,
                        pendingProposals: 0,
                        acceptedProposals: 0
                    }
                });
                return;
            }

            const stats = await briefService.getBrandStats(brandProfile.id);

            res.json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch statistics'
            });
        }
    }

    /**
     * Get a single brief by ID
     * GET /api/briefs/:id
     */
    async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = req.user!;

            const brief = await briefService.getBriefById(id, user.id, user.role);

            res.json({
                success: true,
                data: brief
            });
        } catch (error: any) {
            const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to fetch brief'
            });
        }
    }

    /**
     * Update a brief
     * PATCH /api/briefs/:id
     */
    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            // Validate request body
            const { error, value } = validateBriefUpdate.validate(req.body);
            if (error) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.details.map(d => d.message)
                });
                return;
            }

            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!brandProfile) {
                res.status(404).json({
                    success: false,
                    message: 'Brand profile not found'
                });
                return;
            }

            const updateData: BriefUpdateDTO = value;
            const brief = await briefService.updateBrief(id, brandProfile.id, updateData);

            res.json({
                success: true,
                message: 'Brief updated successfully',
                data: brief
            });
        } catch (error: any) {
            const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 :
                error.message.includes('Cannot modify') ? 403 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to update brief'
            });
        }
    }

    /**
     * Delete a brief
     * DELETE /api/briefs/:id
     */
    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (!brandProfile) {
                res.status(404).json({
                    success: false,
                    message: 'Brand profile not found'
                });
                return;
            }

            await briefService.deleteBrief(id, brandProfile.id);

            res.json({
                success: true,
                message: 'Brief deleted successfully'
            });
        } catch (error: any) {
            const statusCode = error.message.includes('not found') || error.message.includes('Access denied') ? 404 :
                error.message.includes('Only draft') ? 403 : 500;
            res.status(statusCode).json({
                success: false,
                message: error.message || 'Failed to delete brief'
            });
        }
    }
}

export default new BriefController();
