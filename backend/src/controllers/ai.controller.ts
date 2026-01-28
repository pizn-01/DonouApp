import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { BriefService } from '../services/brief.service';
import aiService from '../services/ai.service';
import uploadService from '../services/upload.service';
import { validateAiPrompt } from '../validators/brief.validator';

const briefService = new BriefService();

// =============================================
// AI Controller
// =============================================

export class AiController {
    /**
     * Generate a brief from AI prompt
     * POST /api/ai/generate-brief
     */
    async generateBrief(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            // Validate request body using Zod
            const result = validateAiPrompt.safeParse(req.body);
            if (!result.success) {
                res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: result.error.errors.map(e => e.message)
                });
                return;
            }

            const { prompt } = result.data;
            const user = req.user!;

            // Generate brief using AI
            const generatedBrief = await aiService.generateBriefFromPrompt(prompt);

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

            // Create the brief in database
            const brief = await briefService.createAiBrief(brandProfile.id, {
                title: generatedBrief.title,
                description: generatedBrief.description,
                requirements: generatedBrief.requirements,
                budget_range_min: generatedBrief.budget_range_min,
                budget_range_max: generatedBrief.budget_range_max,
                currency: generatedBrief.currency,
                timeline: generatedBrief.timeline
            });

            res.status(201).json({
                success: true,
                message: 'AI-generated brief created successfully',
                data: brief,
                metadata: {
                    ai_generated: true,
                    category: generatedBrief.category
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to generate brief'
            });
        }
    }

    /**
     * Upload files for briefs
     * POST /api/upload
     */
    async uploadFiles(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
                res.status(400).json({
                    success: false,
                    message: 'No files provided'
                });
                return;
            }

            const files = req.files as Express.Multer.File[];

            // Validate each file
            for (const file of files) {
                const validation = uploadService.validateFile(file);
                if (!validation.valid) {
                    // Clean up uploaded files if validation fails
                    await uploadService.deleteFiles(files.map(f => f.path));

                    res.status(400).json({
                        success: false,
                        message: validation.error
                    });
                    return;
                }
            }

            // Process files and get URLs
            const fileUrls = await uploadService.processUploadedFiles(files);

            res.json({
                success: true,
                message: 'Files uploaded successfully',
                data: {
                    urls: fileUrls,
                    count: fileUrls.length
                }
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to upload files'
            });
        }
    }
}

export default new AiController();
