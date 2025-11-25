import express from 'express';
import {
  createReview,
  checkReviewExists,
  getRoomReviews,
  getMyReviews
} from '../controllers/reviewController.js';
import { protectClient } from '../middleware/clientAuthMiddleware.js';

const router = express.Router();

router.post('/',protectClient, createReview);
router.get('/check/:bookingId', protectClient, checkReviewExists);
router.get('/my-reviews', protectClient, getMyReviews);

// Public routes
router.get('/room/:roomTypeId', getRoomReviews);

export default router;