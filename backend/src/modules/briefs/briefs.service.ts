import { supabaseAdmin, openai, AI_CONFIG } from '../../config';
import { Errors } from '../../middleware';
import { BriefStatus } from '../../types';
import {
    CreateBriefInput,
    UpdateBriefInput,
    GenerateBriefInput,
    BriefQuery
} from './briefs.schemas';

export class BriefsService {
    /**
     * Create a new brief
     */
    async create(brandId: string, input: CreateBriefInput) {
        const { data, error } = await supabaseAdmin
            .from('briefs')
            .insert({
                brand_id: brandId,
                title: input.title,
                description: input.description,
                requirements: input.requirements,
                budget: input.budget,
                timeline: input.timeline,
                category: input.category,
                status: BriefStatus.DRAFT,
                ai_generated: false,
            })
            .select()
            .single();

        if (error) {
            throw Errors.internal(`Failed to create brief: ${error.message}`);
        }

        return data;
    }

    /**
     * Generate brief using AI
     */
    async generateWithAI(brandId: string, input: GenerateBriefInput) {
        const prompt = this.buildBriefGenerationPrompt(input);

        try {
            const completion = await openai.chat.completions.create({
                model: AI_CONFIG.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert manufacturing brief writer. Generate detailed, professional project briefs for brands looking to manufacture products. 
            Return your response as a valid JSON object with the following structure:
            {
              "title": "Brief title",
              "description": "Detailed description",
              "requirements": {
                "productType": "Type of product",
                "quantity": number,
                "specifications": ["spec1", "spec2"],
                "qualityStandards": ["standard1"],
                "packagingRequirements": "Packaging details",
                "additionalNotes": "Any extra notes"
              },
              "budget": {
                "min": number,
                "max": number,
                "currency": "USD"
              },
              "timeline": "Expected timeline",
              "category": "Product category"
            }`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: AI_CONFIG.maxTokens.briefGeneration,
                temperature: AI_CONFIG.temperature.briefGeneration,
            });

            const responseText = completion.choices[0]?.message?.content;
            if (!responseText) {
                throw new Error('No response from AI');
            }

            // Parse the JSON response
            const briefData = JSON.parse(responseText);

            // Save the generated brief
            const { data, error } = await supabaseAdmin
                .from('briefs')
                .insert({
                    brand_id: brandId,
                    title: briefData.title,
                    description: briefData.description,
                    requirements: briefData.requirements,
                    budget: briefData.budget,
                    timeline: briefData.timeline,
                    category: briefData.category,
                    status: BriefStatus.DRAFT,
                    ai_generated: true,
                })
                .select()
                .single();

            if (error) {
                throw Errors.internal('Failed to save generated brief');
            }

            return data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw Errors.internal('Failed to parse AI response');
            }
            throw error;
        }
    }

    /**
     * Get all briefs for a brand
     */
    async findByBrand(brandId: string, query: BriefQuery) {
        const { page = 1, limit = 20, status, category, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const offset = (page - 1) * limit;

        let queryBuilder = supabaseAdmin
            .from('briefs')
            .select('*', { count: 'exact' })
            .eq('brand_id', brandId);

        if (status) {
            queryBuilder = queryBuilder.eq('status', status);
        }

        if (category) {
            queryBuilder = queryBuilder.eq('category', category);
        }

        // Map sortBy to database column names
        const columnMap: Record<string, string> = {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            title: 'title',
        };

        queryBuilder = queryBuilder
            .order(columnMap[sortBy] || 'created_at', { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await queryBuilder;

        if (error) {
            throw Errors.internal('Failed to fetch briefs');
        }

        return {
            briefs: data,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit),
            },
        };
    }

    /**
     * Get a single brief by ID
     */
    async findById(briefId: string, userId?: string) {
        const { data, error } = await supabaseAdmin
            .from('briefs')
            .select('*')
            .eq('id', briefId)
            .single();

        if (error || !data) {
            throw Errors.notFound('Brief');
        }

        // If userId provided, verify ownership
        if (userId && data.brand_id !== userId) {
            throw Errors.forbidden('You do not have access to this brief');
        }

        return data;
    }

    /**
     * Update a brief
     */
    async update(briefId: string, brandId: string, input: UpdateBriefInput) {
        // Verify ownership
        await this.findById(briefId, brandId);

        const updateData: Record<string, unknown> = {};

        if (input.title) updateData.title = input.title;
        if (input.description) updateData.description = input.description;
        if (input.requirements) updateData.requirements = input.requirements;
        if (input.budget) updateData.budget = input.budget;
        if (input.timeline) updateData.timeline = input.timeline;
        if (input.category) updateData.category = input.category;
        if (input.status) updateData.status = input.status;

        const { data, error } = await supabaseAdmin
            .from('briefs')
            .update(updateData)
            .eq('id', briefId)
            .select()
            .single();

        if (error) {
            throw Errors.internal('Failed to update brief');
        }

        return data;
    }

    /**
     * Delete a brief
     */
    async delete(briefId: string, brandId: string) {
        // Verify ownership
        await this.findById(briefId, brandId);

        const { error } = await supabaseAdmin
            .from('briefs')
            .delete()
            .eq('id', briefId);

        if (error) {
            throw Errors.internal('Failed to delete brief');
        }

        return { message: 'Brief deleted successfully' };
    }

    /**
     * Publish a brief (change status to ACTIVE)
     */
    async publish(briefId: string, brandId: string) {
        const brief = await this.findById(briefId, brandId);

        if (brief.status !== BriefStatus.DRAFT) {
            throw Errors.badRequest('Only draft briefs can be published');
        }

        return this.update(briefId, brandId, { status: BriefStatus.ACTIVE });
    }

    /**
     * Build AI prompt for brief generation
     */
    private buildBriefGenerationPrompt(input: GenerateBriefInput): string {
        let prompt = `Generate a detailed manufacturing brief for the following:

Product Type: ${input.productType}
Quantity: ${input.quantity} units`;

        if (input.targetMarket) {
            prompt += `\nTarget Market: ${input.targetMarket}`;
        }

        if (input.budgetRange) {
            prompt += `\nBudget Range: ${input.budgetRange}`;
        }

        if (input.timeline) {
            prompt += `\nDesired Timeline: ${input.timeline}`;
        }

        if (input.additionalDetails) {
            prompt += `\nAdditional Details: ${input.additionalDetails}`;
        }

        prompt += `\n\nPlease generate a comprehensive brief with appropriate specifications, quality standards, and realistic budget estimates based on the product type and quantity.`;

        return prompt;
    }
}

export const briefsService = new BriefsService();
