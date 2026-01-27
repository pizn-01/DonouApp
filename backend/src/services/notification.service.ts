import { supabase } from '../config/database';

export enum NotificationType {
    PROPOSAL_RECEIVED = 'PROPOSAL_RECEIVED',
    MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
    BRIEF_MATCHED = 'BRIEF_MATCHED',
    PROPOSAL_ACCEPTED = 'PROPOSAL_ACCEPTED',
    PROPOSAL_REJECTED = 'PROPOSAL_REJECTED',
    PROJECT_UPDATE = 'PROJECT_UPDATE'
}

export class NotificationService {
    /**
     * Create a new notification
     */
    async createNotification(
        userId: string,
        type: NotificationType,
        title: string,
        message: string,
        data: any = {}
    ): Promise<void> {
        const { error } = await supabase
            .from('notifications')
            .insert({
                user_id: userId,
                type,
                title,
                message,
                data,
                is_read: false
            });

        if (error) {
            console.error('Failed to create notification:', error);
            // Don't throw error to avoid breaking the main flow
        }
    }

    /**
     * Get user notifications
     */
    async getUserNotifications(userId: string, limit = 20) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw new Error(`Failed to fetch notifications: ${error.message}`);
        return data || [];
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string, userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .eq('user_id', userId);

        if (error) throw new Error(`Failed to update notification: ${error.message}`);
    }

    /**
     * Mark all as read
     */
    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userId)
            .eq('is_read', false);

        if (error) throw new Error(`Failed to update notifications: ${error.message}`);
    }
}

export const notificationService = new NotificationService();
