import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getAttendantDashboardData } from '../controllers/attendantDashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, getAttendantDashboardData);

export default router;