import { apiClient } from '@/lib/apiClient';
// import { API_ENDPOINTS } from '@/config/api';

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    data: any;
    is_read: boolean;
    created_at: string;
}

class NotificationService {
    async getMyNotifications(): Promise<Notification[]> {
        // Assuming API_ENDPOINTS.NOTIFICATIONS exists or we construct it.
        // It wasn't in api.ts previously, but checking earlier file read of api.ts...
        // api.ts only had AUTH, ONBOARDING, BRIEFS, PROPOSALS, DASHBOARD, HEALTH.
        // So we should construct the URL or add it to api.ts.
        // I'll construct it using API_BASE_URL (which needs to be imported if we use it)
        // Or better, just use string literal '/notifications' relative to baseURL if apiClient supports it?
        // apiClient has baseURL set. So we can just use '/notifications'.
        const response = await apiClient.get('/notifications');
        return response.data.data;
    }

    async markAsRead(id: string): Promise<void> {
        await apiClient.patch(`/notifications/${id}/read`);
    }

    async markAllAsRead(): Promise<void> {
        await apiClient.patch('/notifications/read-all');
    }
}

export const notificationService = new NotificationService();
