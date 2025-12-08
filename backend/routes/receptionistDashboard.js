import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getReceptionistDashboardData } from '../controllers/receptionistDashboardController.js';

const router = express.Router();

router.get('/', authMiddleware, getReceptionistDashboardData);

export default router;