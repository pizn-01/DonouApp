import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
    private getHeaders() {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    /**
     * Start or Get Conversation
     */
    async initConversation(briefId: string, manufacturerId: string, brandId: string): Promise<Conversation> {
        const response = await axios.post(`${API_URL}/conversations`, {
            briefId, manufacturerId, brandId
        }, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    /**
     * Get My Conversations
     */
    async getMyConversations(): Promise<Conversation[]> {
        const response = await axios.get(`${API_URL}/conversations`, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    /**
     * Get Messages
     */
    async getMessages(conversationId: string): Promise<Message[]> {
        const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages`, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    /**
     * Send Message
     */
    async sendMessage(conversationId: string, content: string): Promise<Message> {
        const response = await axios.post(`${API_URL}/conversations/${conversationId}/messages`, {
            content
        }, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }
}

export const messagingService = new MessagingService();
