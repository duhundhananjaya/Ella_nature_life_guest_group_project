import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import featureRoutes from './routes/feature.js';
import facilityRoutes from './routes/facility.js';
import roomsRoutes from './routes/room.js';
import clientRoomsRoutes from './routes/clientRoom.js';
import roomInstancesRoutes from './routes/roomInstance.js';
import siteSettingsRoutes from './routes/siteSettings.js';
import clientSiteSettingsRoutes from './routes/clientSiteSettings.js';
import galleryRoutes from "./routes/gallery.js";
import feedbackRoutes from './routes/feedback.js';
import clientAuthRoutes from './routes/clientAuthRoutes.js';
import bookingRoutes from './routes/booking.js';
import viewBookingRoutes from './routes/viewBooking.js';
import paymentWebhookRouter from './routes/paymentWebhook.js';
import paymentApiRouter from './routes/payment.js';
import viewClientsRoutes from './routes/viewClients.js';
import telegramSettingsRoutes from './routes/telegramSettings.js';
import reviewRoutes from './routes/review.js';
import viewReviewRoutes from './routes/viewReview.js';
import viewFeedbackRoutes from './routes/viewFeedback.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads/icons', express.static('public/uploads/icons'));
app.use('/uploads/rooms', express.static('public/uploads/rooms'));
app.use('/uploads/gallery', express.static('public/uploads/gallery'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true}))
app.use(express.static('public/uploads/icons'));
app.use(express.static('public/uploads/rooms'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/features', featureRoutes);
app.use('/api/facility', facilityRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/room-instances', roomInstancesRoutes);
app.use('/api/client-rooms', clientRoomsRoutes);
app.use('/api/site-settings', siteSettingsRoutes);
app.use('/api/telegram-settings', telegramSettingsRoutes);
app.use('/api/client-site-settings', clientSiteSettingsRoutes);
app.use("/api/gallery", galleryRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/client/auth', clientAuthRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/view-bookings', viewBookingRoutes);
app.use('/api/webhook/stripe', paymentWebhookRouter);
app.use('/api/payment', paymentApiRouter);
app.use('/api/view-clients', viewClientsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/view-reviews', viewReviewRoutes);
app.use('/api/view-feedbacks', viewFeedbackRoutes);

app.listen(process.env.PORT, () =>{
    connectDB();
    console.log('Server is running on http://localhost:3000');
})

// NEW: Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
}); 

// NEW: Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// NEW: 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
