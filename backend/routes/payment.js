import express from 'express';
import stripe from 'stripe';
import 'dotenv/config';
import Booking from '../models/Booking.js';
import { protectClient } from '../middleware/clientAuthMiddleware.js';

const router = express.Router();

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session for booking payment
const createCheckoutSession = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const clientId = req.client._id;

    // Find the booking
    const booking = await Booking.findOne({
      _id: bookingId,
      client: clientId,
      paymentStatus: 'pending'
    }).populate('roomType', 'room_name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or already paid'
      });
    }

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${booking.roomType.room_name} - Booking #${booking.bookingId}`,
              description: `Check-in: ${new Date(booking.checkIn).toLocaleDateString()} - Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: booking._id.toString(),
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
      metadata: {
        bookingId: booking._id.toString(),
        bookingNumber: booking.bookingId
      }
    });

    // Update booking with session ID
    booking.stripeSessionId = session.id;
    await booking.save();

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating payment session',
      error: error.message
    });
  }
};

// Get payment status
const getPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const clientId = req.client._id;

    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    // Find booking by session ID
    const booking = await Booking.findOne({
      stripeSessionId: sessionId,
      client: clientId
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    return res.status(200).json({
      success: true,
      paymentStatus: session.payment_status,
      bookingStatus: booking.paymentStatus
    });

  } catch (error) {
    console.error('Error getting payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving payment status',
      error: error.message
    });
  }
};

router.post('/create-checkout-session', protectClient, createCheckoutSession);
router.get('/status/:sessionId', protectClient, getPaymentStatus);

export default router;