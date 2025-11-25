import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getReviews } from '../controllers/viewReviewsController.js';

const router = express.Router();

router.get('/', authMiddleware, getReviews);

export default router;