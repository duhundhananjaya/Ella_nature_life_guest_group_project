import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { updateBooking, getBookings, deleteBooking } from '../controllers/viewBookingController.js';

const router = express.Router();

router.put('/update/:id', authMiddleware, updateBooking);
router.get('/', authMiddleware, getBookings);
router.delete('/delete/:id', authMiddleware, deleteBooking);

export default router;