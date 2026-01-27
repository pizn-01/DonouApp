import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

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
    private getHeaders() {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };
    }

    async getMyNotifications(): Promise<Notification[]> {
        const response = await axios.get(`${API_URL}/notifications`, {
            headers: this.getHeaders(),
        });
        return response.data.data;
    }

    async markAsRead(id: string): Promise<void> {
        await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
            headers: this.getHeaders(),
        });
    }

    async markAllAsRead(): Promise<void> {
        await axios.patch(`${API_URL}/notifications/read-all`, {}, {
            headers: this.getHeaders(),
        });
    }
}

export const notificationService = new NotificationService();
