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
            // Validate request body using Zod
            const result = validateBriefCreate.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.error.errors.map(e => e.message)
                });
                return;
            }
            const value = result.data;

            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.userId)
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
            // Validate query parameters using Zod
            const result = validateBriefFilters.safeParse(req.query);
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.error.errors.map(e => e.message)
                });
                return;
            }

            const user = req.user!;
            const filters = result.data as BriefFilters;

            const briefsResult = await briefService.getBriefs(user.userId, user.role, filters);

            res.json({
                success: true,
                data: briefsResult.data,
                pagination: briefsResult.pagination
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
            console.log('[BriefController.getStats] User:', { userId: user.userId, role: user.role });

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile, error } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.userId)
                .single();

            if (error || !brandProfile) {
                console.warn('[BriefController.getStats] Brand profile not found for user:', user.userId, 'Returning empty stats.');
                // Return empty stats instead of 404 to prevent dashboard crash
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

            console.log('[BriefController.getStats] Found Brand Profile:', brandProfile.id);

            const stats = await briefService.getBrandStats(brandProfile.id);

            res.json({
                success: true,
                data: stats
            });
        } catch (error: any) {
            console.error('[BriefController.getStats] Error:', error);
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

            const brief = await briefService.getBriefById(id, user.userId, user.role);

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

            // Validate request body using Zod
            const result = validateBriefUpdate.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.error.errors.map(e => e.message)
                });
                return;
            }

            const user = req.user!;

            // Get brand profile ID
            const { supabase } = await import('../config/database');
            const { data: brandProfile } = await supabase
                .from('brand_profiles')
                .select('id')
                .eq('user_id', user.userId)
                .single();

            if (!brandProfile) {
                res.status(404).json({
                    success: false,
                    message: 'Brand profile not found'
                });
                return;
            }

            const updateData = result.data as BriefUpdateDTO;
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
                .eq('user_id', user.userId)
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
