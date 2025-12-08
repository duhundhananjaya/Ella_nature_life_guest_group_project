import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getClerkDashboardData } from '../controllers/clerkDashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, getClerkDashboardData);

export default router;