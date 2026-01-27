import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types';
import { messagingService } from '../services/messaging.service';

export class MessagingController {
    /**
     * Get or create conversation
     * POST /api/conversations
     * Body: { briefId, manufacturerId } (If Brand) OR { briefId } (If Manu, derived)
     */
    async initConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { briefId, manufacturerId, brandId } = req.body;
            // Logic to determine participants based on role
            // Simplified: Expect IDs to be passed or derived.

            // Implemenation detail:
            // If User is Brand -> Provide ManufacturerID
            // If User is Manufacturer -> Provide (or key off) BrandID (from brief)

            // For MVP, letting client send explicit IDs, verified by service logic if needed.
            // We assume validated inputs.

            const conversation = await messagingService.getCreateConversation(briefId, brandId, manufacturerId);
            res.json({ success: true, data: conversation });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get my conversations
     * GET /api/conversations
     */
    async getMyConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user!.id;
            const conversations = await messagingService.getUserConversations(userId);
            res.json({ success: true, data: conversations });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Send Message
     * POST /api/conversations/:id/messages
     */
    async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const userId = req.user!.id;

            const message = await messagingService.sendMessage(id, userId, content);
            res.json({ success: true, data: message });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Get Messages
     * GET /api/conversations/:id/messages
     */
    async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            // Should verify participation access here
            const messages = await messagingService.getMessages(id);
            res.json({ success: true, data: messages });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new MessagingController();
