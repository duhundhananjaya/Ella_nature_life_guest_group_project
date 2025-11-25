import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const clientId = req.client._id.toString();; // Assuming you have auth middleware that sets req.user

    // Validate input
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID, rating, and comment are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if booking exists and belongs to the user
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.client.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own bookings'
      });
    }

    // Check if booking is checked-out
    if (booking.status !== 'checked-out') {
      return res.status(400).json({
        success: false,
        message: 'You can only review checked-out bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    

    // Create the review
    const review = new Review({
      booking: bookingId,
      client: clientId,
      roomType: booking.roomType,
      rating,
      comment: comment.trim()
    });

    await review.save();

    // Populate the review with client and room details
    await review.populate(['client', 'roomType']);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });

  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle duplicate review error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this booking'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// Check if booking has been reviewed
export const checkReviewExists = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const clientId = req.client._id.toString();

    // Verify booking belongs to user
    const booking = await Booking.findById(bookingId);

    console.log("Booking.client =", booking.client.toString());
console.log("Logged in client =", clientId.toString());
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.client.toString() !== clientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check if review exists
    const review = await Review.findOne({ booking: bookingId });

    res.json({
      success: true,
      hasReview: !!review,
      review: review || null
    });

  } catch (error) {
    console.error('Error checking review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check review status',
      error: error.message
    });
  }
};

// Get all reviews for a room type
export const getRoomReviews = async (req, res) => {
  try {
    const { roomTypeId } = req.params;

    const reviews = await Review.find({ roomType: roomTypeId })
      .populate('client', 'name email')
      .sort({ created_at: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      data: {
        reviews,
        totalReviews: reviews.length,
        averageRating: averageRating.toFixed(1)
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get client's reviews
export const getMyReviews = async (req, res) => {
  try {
    const clientId = req.client._id.toString();

    const reviews = await Review.find({ client: clientId })
      .populate('roomType', 'room_name')
      .populate('booking', 'bookingId checkIn checkOut')
      .sort({ created_at: -1 });

    res.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};