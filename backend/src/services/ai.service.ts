import OpenAI from 'openai';
import { AiGeneratedBrief, BriefRequirements } from '../types/brief.types';

// =============================================
// AI Brief Service
// =============================================

export class AiBriefService {
    private openai: OpenAI | null = null;
    private isConfigured: boolean = false;

    constructor() {
        // Initialize OpenAI only if API key is available
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey && apiKey !== '') {
            this.openai = new OpenAI({ apiKey });
            this.isConfigured = true;
        } else {
            console.warn('⚠️  OpenAI API key not configured. AI generation will use mock responses.');
        }
    }

    /**
     * Generate a structured brief from a natural language prompt
     */
    async generateBriefFromPrompt(prompt: string): Promise<AiGeneratedBrief> {
        if (this.isConfigured && this.openai) {
            return await this.generateWithOpenAI(prompt);
        } else {
            return this.generateMockBrief(prompt);
        }
    }

    /**
     * Generate brief using OpenAI GPT-4
     */
    private async generateWithOpenAI(prompt: string): Promise<AiGeneratedBrief> {
        try {
            const completion = await this.openai!.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: `You are a B2B manufacturing assistant helping brands create detailed production briefs. 
Your task is to convert natural language descriptions into structured manufacturing briefs.

Analyze the user's input and extract:
- Product type and category
- Quantity requirements
- Material specifications
- Quality standards
- Budget estimates (in USD)
- Timeline estimates
- Any special requirements

Return ONLY valid JSON in this exact structure:
{
  "title": "Brief, descriptive project title",
  "description": "Detailed 2-3 paragraph description of the project",
  "requirements": {
    "productType": "Main product type",
    "quantity": number,
    "specifications": ["spec1", "spec2", "spec3"],
    "qualityStandards": ["standard1", "standard2"],
    "packagingRequirements": "Packaging details if mentioned",
    "additionalNotes": "Any other important notes"
  },
  "budget_range_min": number,
  "budget_range_max": number,
  "currency": "USD",
  "timeline": "Estimated timeline (e.g., '2-3 months')",
  "category": "Industry category (e.g., 'Apparel', 'Electronics', 'Furniture')"
}

Be realistic with budget estimates based on quantity and product type.
If information is not provided, make reasonable assumptions based on industry standards.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500,
                response_format: { type: "json_object" }
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('Empty response from OpenAI');
            }

            const parsedBrief = JSON.parse(response) as AiGeneratedBrief;

            // Validate the structure
            this.validateGeneratedBrief(parsedBrief);

            return parsedBrief;
        } catch (error: any) {
            console.error('OpenAI generation error:', error);
            // Fallback to mock if OpenAI fails
            return this.generateMockBrief(prompt);
        }
    }

    /**
     * Generate mock brief (fallback when OpenAI is unavailable)
     */
    private generateMockBrief(prompt: string): AiGeneratedBrief {
        // Extract some basic info from prompt
        const lowerPrompt = prompt.toLowerCase();
        const hasQuantity = lowerPrompt.match(/(\d+)\s*(units|pieces|pcs)/i);
        const quantity = hasQuantity ? parseInt(hasQuantity[1]) : 1000;

        // Determine category based on keywords
        let category = 'General';
        let productType = 'Custom Product';

        if (lowerPrompt.includes('shirt') || lowerPrompt.includes('apparel') || lowerPrompt.includes('clothing')) {
            category = 'Apparel';
            productType = 'Apparel Item';
        } else if (lowerPrompt.includes('electronic') || lowerPrompt.includes('circuit') || lowerPrompt.includes('pcb')) {
            category = 'Electronics';
            productType = 'Electronic Component';
        } else if (lowerPrompt.includes('furniture') || lowerPrompt.includes('chair') || lowerPrompt.includes('table')) {
            category = 'Furniture';
            productType = 'Furniture Piece';
        } else if (lowerPrompt.includes('packaging') || lowerPrompt.includes('box')) {
            category = 'Packaging';
            productType = 'Packaging Solution';
        }

        // Estimate budget based on quantity
        const unitCost = category === 'Electronics' ? 25 : category === 'Furniture' ? 150 : 15;
        const budgetMin = Math.round(quantity * unitCost * 0.8);
        const budgetMax = Math.round(quantity * unitCost * 1.2);

        const requirements: BriefRequirements = {
            productType,
            quantity,
            specifications: [
                'Standard quality materials',
                'Industry-standard manufacturing process',
                'Quality inspection required'
            ],
            qualityStandards: ['ISO 9001'],
            additionalNotes: `AI-generated brief based on input: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`
        };

        return {
            title: `${productType} Manufacturing Project`,
            description: `This is an AI-assisted manufacturing brief for producing ${quantity} units of ${productType.toLowerCase()}.

The project involves working with a reliable manufacturer to produce high-quality products that meet industry standards. The manufacturer should have experience in ${category.toLowerCase()} production and be able to provide samples for approval before full production.

Additional details and specifications can be refined during the proposal review phase.`,
            requirements,
            budget_range_min: budgetMin,
            budget_range_max: budgetMax,
            currency: 'USD',
            timeline: quantity > 5000 ? '4-6 months' : quantity > 1000 ? '2-3 months' : '1-2 months',
            category
        };
    }

    /**
     * Validate the structure of generated brief
     */
    private validateGeneratedBrief(brief: any): void {
        const required = ['title', 'description', 'requirements', 'budget_range_min', 'budget_range_max', 'currency', 'timeline', 'category'];

        for (const field of required) {
            if (!brief[field]) {
                throw new Error(`Invalid AI response: missing field '${field}'`);
            }
        }

        // Validate requirements structure
        if (!brief.requirements.productType || !brief.requirements.quantity || !brief.requirements.specifications) {
            throw new Error('Invalid AI response: incomplete requirements');
        }

        // Ensure specifications is an array
        if (!Array.isArray(brief.requirements.specifications)) {
            throw new Error('Invalid AI response: specifications must be an array');
        }
    }
}

export default new AiBriefService();
