
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { createReceptionistBooking } from '../controllers/receptionistBookingController.js';

const router = express.Router();

router.post('/create', authMiddleware, createReceptionistBooking);

export default router;