import express from 'express';
import { 
  getTelegramSettings, 
  updateTelegramSettings, 
  testTelegramNotification,
  deleteTelegramSettings 
} from '../controllers/telegramSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Adjust based on your auth middleware

const router = express.Router();

// Get telegram settings
router.get('/', authMiddleware, getTelegramSettings);

// Update or create telegram settings
router.post('/', authMiddleware, updateTelegramSettings);

// Test telegram notification
router.post('/test', authMiddleware, testTelegramNotification);

// Delete telegram settings
router.delete('/', authMiddleware, deleteTelegramSettings);

export default router;