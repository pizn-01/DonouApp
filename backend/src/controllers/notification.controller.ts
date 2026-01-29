import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { notificationService } from '../services/notification.service';

export class NotificationController {
    /**
     * Get my notifications
     * GET /api/notifications
     */
    async getMyNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            console.log('[NotificationController.getMyNotifications] Fetching for user:', userId);
            const notifications = await notificationService.getUserNotifications(userId);
            res.json({ success: true, data: notifications });
        } catch (error: any) {
            console.error('[NotificationController.getMyNotifications] Error:', error);
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Mark as read
     * PATCH /api/notifications/:id/read
     */
    async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            await notificationService.markAsRead(id, userId);
            res.json({ success: true, message: 'Marked as read' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Mark all as read
     * PATCH /api/notifications/read-all
     */
    async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            await notificationService.markAllAsRead(userId);
            res.json({ success: true, message: 'All marked as read' });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new NotificationController();
