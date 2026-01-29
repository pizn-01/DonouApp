import { apiClient } from "@/lib/apiClient";

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_ai_generated: boolean;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    id: string;
    brief_id: string;
    brand_id: string;
    manufacturer_id: string;
    created_at: string;
    updated_at: string;
    brief?: { id: string; title: string };
    brand?: { id: string; company_name: string; logo_url: string };
    manufacturer?: { id: string; company_name: string; logo_url: string };
    last_message?: Message;
}

class MessagingService {
    /**
     * Start or Get Conversation
     */
    async initConversation(briefId: string, manufacturerId: string, brandId: string): Promise<Conversation> {
        const response = await apiClient.post('/conversations', {
            briefId,
            manufacturerId,
            brandId
        });
        return response.data.data;
    }

    /**
     * Get My Conversations
     */
    async getMyConversations(): Promise<Conversation[]> {
        const response = await apiClient.get('/conversations');
        return response.data.data;
    }

    /**
     * Get Messages
     */
    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await apiClient.get(`/conversations/${conversationId}/messages`);
        return response.data.data;
    }

    /**
     * Send Message
     */
    async sendMessage(conversationId: string, content: string): Promise<Message> {
        const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
            content
        });
        return response.data.data;
    }
}

export const messagingService = new MessagingService();
