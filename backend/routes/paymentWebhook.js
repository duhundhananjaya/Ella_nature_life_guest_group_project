import express from 'express';
import stripe from 'stripe'; 
import 'dotenv/config';
import Booking from '../models/Booking.js'; // Assuming you have a Booking model

const router = express.Router();
// Use the Secret Key for API calls and the Webhook Secret for verification
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Initialize Stripe instance
const stripeInstance = stripe(STRIPE_SECRET_KEY);

// --- Actual MongoDB Update Function ---
async function updateBookingStatus(bookingId, paymentIntentId) {
    try {
        // Use the bookingId (client_reference_id) to find and update the MongoDB record
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: bookingId, paymentStatus: { $ne: 'paid' } }, // Find the booking and ensure it hasn't been paid already (idempotency)
            {
                paymentStatus: 'paid',
                paymentIntentId: paymentIntentId,
                paymentDate: new Date()
            },
            { new: true }
        );

        if (updatedBooking) {
            console.log(`[MongoDB Update] Booking ${bookingId} status changed to 'Paid'.`);
            return true;
        } else {
            console.log(`[MongoDB Update] Booking ${bookingId} not found or already paid.`);
            return false;
        }
    } catch (error) {
        console.error(`🚨 MongoDB Error during webhook for booking ${bookingId}:`, error);
        throw new Error("Database update failed.");
    }
}


// NOTE: This middleware is explicitly configured to read the raw request body.
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
    let event;

    try {
        // Step 1: Verify the event came from Stripe using the Webhook Secret
        event = stripeInstance.webhooks.constructEvent(req.body, signature, WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        // Immediately return 400 if verification fails
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Step 2: Handle the specific event type
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const bookingId = session.client_reference_id; 
        
        if (session.payment_status === 'paid' && bookingId) {
            try {
                // Step 3: Update your MongoDB database securely
                await updateBookingStatus(bookingId, session.payment_intent);
                console.log(`Webhook: Payment confirmed for booking ${bookingId}`);
            } catch (error) {
                console.error(` Webhook: Failed to update DB for booking ${bookingId}:`, error);
                // Returning 500 signals Stripe to retry sending the webhook
                return res.status(500).end(); 
            }
        }
    } else {
        console.log(`Webhook: Received unhandled event type ${event.type}`);
    }

    // Step 4: Always return 200 status code to Stripe so it stops retrying the event.
    res.status(200).json({ received: true });
});

export default router;