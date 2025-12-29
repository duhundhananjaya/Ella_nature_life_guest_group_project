import express from 'express';
import { protectClient } from '../middleware/clientAuthMiddleware.js';
import {
  checkAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  updatePaymentStatus
} from '../controllers/bookingController.js';

const router = express.Router();

// Public route - check availability (no auth required)
router.post('/check-availability', checkAvailability);

// Protected routes - require client authentication
router.post('/create', protectClient, createBooking);
router.post('/update-payment-status', protectClient, updatePaymentStatus);
router.get('/my-bookings', protectClient, getMyBookings);
router.get('/:id', protectClient, getBookingById);
router.put('/cancel/:id', protectClient, cancelBooking);

export default router;