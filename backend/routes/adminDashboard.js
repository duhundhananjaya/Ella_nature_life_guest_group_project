import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAdminDashboardData } from '../controllers/adminDashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, getAdminDashboardData);

export default router;