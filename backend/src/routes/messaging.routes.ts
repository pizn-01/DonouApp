import { Router } from 'express';
import messagingController from '../controllers/messaging.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', messagingController.initConversation.bind(messagingController));
router.get('/', messagingController.getMyConversations.bind(messagingController));
router.get('/:id/messages', messagingController.getMessages.bind(messagingController));
router.post('/:id/messages', messagingController.sendMessage.bind(messagingController));

export default router;
