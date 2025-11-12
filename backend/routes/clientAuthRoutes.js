import express from 'express';
const router = express.Router();
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword
} from '../controllers/clientAuthController.js';
import { protectClient, requireEmailVerification } from '../middleware/clientAuthMiddleware.js';

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me', protectClient, getMe);
router.put('/update-profile', protectClient, updateProfile);
router.put('/change-password', protectClient, changePassword);

export default router;