import { supabase } from '../config/database';

export class MessagingService {
    /**
     * Get or create a conversation between brand and manufacturer for a brief
     */
    async getCreateConversation(
        briefId: string,
        brandId: string,
        manufacturerId: string
    ) {
        // Check if exists
        const { data: existing, error: _findError } = await supabase
            .from('conversations')
            .select('id')
            .eq('brief_id', briefId)
            .eq('brand_id', brandId)
            .eq('manufacturer_id', manufacturerId)
            .single();

        if (existing) return existing;

        // Create new
        const { data: newVal, error: createError } = await supabase
            .from('conversations')
            .insert({
                brief_id: briefId,
                brand_id: brandId,
                manufacturer_id: manufacturerId
            })
            .select()
            .single();

        if (createError) throw new Error(`Failed to create conversation: ${createError.message}`);
        return newVal;
    }

    /**
     * Get user conversations
     */
    async getUserConversations(userId: string) {
        // We need to check both brand and manufacturer profiles
        // First get profile IDs
        const { data: brandProfile } = await supabase.from('brand_profiles').select('id').eq('user_id', userId).single();
        const { data: manuProfile } = await supabase.from('manufacturer_profiles').select('id').eq('user_id', userId).single();

        let query = supabase.from('conversations').select(`
            *,
            brief:brief_id ( id, title ),
            brand:brand_id ( id, company_name, logo_url ),
            manufacturer:manufacturer_id ( id, company_name, logo_url ),
            last_message:messages ( content, created_at, is_read )
        `).order('updated_at', { ascending: false });

        if (brandProfile) {
            query = query.eq('brand_id', brandProfile.id);
        } else if (manuProfile) {
            query = query.eq('manufacturer_id', manuProfile.id);
        } else {
            return [];
        }

        const { data, error } = await query;
        if (error) throw new Error(error.message);

        // Process to get single last message (supa returns array)
        return data.map((c: any) => ({
            ...c,
            last_message: c.last_message?.[0] || null
        }));
    }

    /**
     * Send a message
     */
    async sendMessage(conversationId: string, senderId: string, content: string) {
        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: senderId,
                content
            })
            .select()
            .single();

        if (error) throw new Error(`Failed to send message: ${error.message}`);

        // Update conversation timestamp
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

        // AI Mock Integration
        if (content.includes('@AI')) {
            await this.handleAiResponse(conversationId, content);
        }

        return message;
    }

    /**
     * Get messages for conversation
     */
    async getMessages(conversationId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:sender_id ( email ) 
            `) // Need profile info ideally, but user table has basic info? Auth users are hidden.
            // We might need to join profiles manually or logic in controller. 
            // For now, return raw, frontend can resolve sender based on ID.
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw new Error(error.message);
        return data;
    }

    /**
     * Mock AI Response
     */
    private async handleAiResponse(_conversationId: string, userContent: string) {
        // Simulate delay
        setTimeout(async () => {
            const aiReply = `[AI Assistant]: I noticed you asked "${userContent}". Here is a suggestion based on the brief details...`;

            // Insert system message (sender_id null? or special system user?)
            // For MVP, letting sender be null or a defined system ID.
            // Using a designated system UUID or leaving sender_id NULL if table allows (it references auth.users).
            // Schema has sender_id REFERENCES auth.users. It might be NOT NULL? Migration didn't specify NOT NULL explicitly but defaults might apply.
            // Assuming it accepts NULL or we have a bot user.
            // Let's assume we can create a fake usage or just bypass constraints? No, FK enforces it.
            // We will NOT insert for now if we don't have a bot user ID.
            // OR we insert as the SAME sender but marked as AI?
            // "is_ai_generated" flag exisits.

            // We'll use the sender's ID but flag it as AI? No that's confusing.
            // We'll skip actual DB insert of AI reply if we don't have a bot user, OR we implement a cleaner way later.
            // Implementation Plan said "mock".
            // Let's just log it for now to avoid FK error.
            console.log("AI needs to reply:", aiReply);

        }, 1000);
    }
}

export const messagingService = new MessagingService();
