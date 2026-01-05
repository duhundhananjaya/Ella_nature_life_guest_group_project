import express from 'express';
import { 
  getAttendantTelegramSettings, 
  updateAttendantTelegramSettings, 
  testAttendantTelegramNotification,
  deleteAttendantTelegramSettings 
} from '../controllers/attendantTelegramSettingsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current attendant's telegram settings
router.get('/', authMiddleware, getAttendantTelegramSettings);

// Update or create attendant's telegram settings
router.post('/', authMiddleware, updateAttendantTelegramSettings);

// Test attendant's telegram notification
router.post('/test', authMiddleware, testAttendantTelegramNotification);

// Delete attendant's telegram settings
router.delete('/', authMiddleware, deleteAttendantTelegramSettings);

export default router;