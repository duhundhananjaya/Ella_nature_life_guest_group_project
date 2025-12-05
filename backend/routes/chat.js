import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getConversations, getMessages, sendMessage, resolveConversation, sendUserMessage, getCustomerMessages } from '../controllers/chatController.js';

const router = express.Router();

// Clerk routes (temporarily disabled auth for testing)
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.patch('/conversations/:conversationId/resolve', resolveConversation);

// Client routes (no auth required for sending messages)
router.post('/send-message', sendUserMessage);
router.get('/messages/:customerId', getCustomerMessages);

export default router;