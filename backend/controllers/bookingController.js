import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import RoomInstance from '../models/RoomInstance.js';
import stripe from 'stripe';
import 'dotenv/config';

// Initialize Stripe
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

// Check Availability
const checkAvailability = async (req, res) => {
  try {
    const { roomTypeId, checkIn, checkOut, roomsNeeded } = req.body;

    // Validate input
    if (!roomTypeId || !checkIn || !checkOut || !roomsNeeded) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields (roomTypeId, checkIn, checkOut, roomsNeeded)' 
      });
    }

    // Parse dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    if (checkInDate < today) {
      return res.status(400).json({ 
        success: false,
        message: 'Check-in date cannot be in the past' 
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Check-out date must be after check-in date' 
      });
    }

    // Get room type details
    const roomType = await Room.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ 
        success: false,
        message: 'Room type not found' 
      });
    }

    if (roomType.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'This room type is currently not available for booking' 
      });
    }

    // Get all active room instances of this type
    const allRoomInstances = await RoomInstance.find({
      room_type: roomTypeId,
      is_active: true,
      maintenance_status: 'good'
    });

    if (allRoomInstances.length === 0) {
      return res.status(200).json({
        success: false,
        available: false,
        availableRooms: 0,
        roomsNeeded: parseInt(roomsNeeded),
        message: 'No rooms available for this room type'
      });
    }

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      roomType: roomTypeId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    }).populate('roomInstances');

    // Get booked room instance IDs
    const bookedRoomIds = new Set();
    overlappingBookings.forEach(booking => {
      booking.roomInstances.forEach(roomInstance => {
        bookedRoomIds.add(roomInstance._id.toString());
      });
    });

    // Calculate available rooms
    const availableRoomInstances = allRoomInstances.filter(
      room => !bookedRoomIds.has(room._id.toString())
    );

    const availableCount = availableRoomInstances.length;
    const requestedRooms = parseInt(roomsNeeded);

    // Calculate price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = roomType.price * nights * requestedRooms;

    if (availableCount >= requestedRooms) {
      return res.status(200).json({
        success: true,
        available: true,
        availableRooms: availableCount,
        roomsNeeded: requestedRooms,
        pricePerNight: roomType.price,
        nights: nights,
        totalPrice: totalPrice,
        message: `Great! ${availableCount} room(s) available for your dates.`
      });
    } else {
      return res.status(200).json({
        success: false,
        available: false,
        availableRooms: availableCount,
        roomsNeeded: requestedRooms,
        message: availableCount === 0 
          ? 'Sorry, no rooms available for the selected dates.' 
          : `Only ${availableCount} room(s) available, but you need ${requestedRooms}.`
      });
    }

  } catch (error) {
    console.error('Availability check error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error checking availability', 
      error: error.message 
    });
  }
};

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { 
      roomTypeId, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      roomsBooked,
      totalPrice,
      specialRequests 
    } = req.body;

    // Get client ID from authenticated user
    const clientId = req.client._id; // This comes from your clientAuthMiddleware

    // Validate input
    if (!roomTypeId || !checkIn || !checkOut || !adults || !roomsBooked || !totalPrice) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Parse dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate dates
    if (checkInDate < today) {
      return res.status(400).json({ 
        success: false,
        message: 'Check-in date cannot be in the past' 
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ 
        success: false,
        message: 'Check-out date must be after check-in date' 
      });
    }

    // Verify room type exists
    const roomType = await Room.findById(roomTypeId);
    if (!roomType) {
      return res.status(404).json({ 
        success: false,
        message: 'Room type not found' 
      });
    }

    if (roomType.status !== 'active') {
      return res.status(400).json({ 
        success: false,
        message: 'This room type is currently not available for booking' 
      });
    }

    // Check capacity
    if (adults > roomType.adult) {
      return res.status(400).json({ 
        success: false,
        message: `Maximum ${roomType.adult} adults allowed per room` 
      });
    }

    if (children > roomType.children) {
      return res.status(400).json({ 
        success: false,
        message: `Maximum ${roomType.children} children allowed per room` 
      });
    }

    // Re-check availability
    const allRoomInstances = await RoomInstance.find({
      room_type: roomTypeId,
      is_active: true,
      maintenance_status: 'good'
    });

    const overlappingBookings = await Booking.find({
      roomType: roomTypeId,
      status: { $in: ['confirmed', 'checked-in'] },
      $or: [
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gt: checkInDate }
        }
      ]
    });

    const bookedRoomIds = new Set();
    overlappingBookings.forEach(booking => {
      booking.roomInstances.forEach(roomId => {
        bookedRoomIds.add(roomId.toString());
      });
    });

    const availableRoomInstances = allRoomInstances.filter(
      room => !bookedRoomIds.has(room._id.toString())
    );

    if (availableRoomInstances.length < roomsBooked) {
      return res.status(400).json({ 
        success: false,
        message: 'Not enough rooms available. Please check availability again.' 
      });
    }

    // Select room instances for this booking
    const selectedRooms = availableRoomInstances.slice(0, roomsBooked);

    // Calculate nights
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Create booking
    const booking = new Booking({
      client: clientId,
      roomType: roomTypeId,
      roomInstances: selectedRooms.map(r => r._id),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: parseInt(adults),
      children: parseInt(children) || 0,
      roomsBooked: parseInt(roomsBooked),
      totalPrice: parseFloat(totalPrice),
      pricePerNight: roomType.price,
      numberOfNights: nights,
      specialRequests: specialRequests || '',
      status: 'confirmed',
      paymentStatus: 'pending'
    });

    await booking.save();

    // Update room instances status to reserved
    await RoomInstance.updateMany(
      { _id: { $in: selectedRooms.map(r => r._id) } },
      { occupancy_status: 'reserved' }
    );

    // Create Stripe checkout session
    let stripeSession = null;
    try {
      stripeSession = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${roomType.room_name} - Booking #${booking.bookingId}`,
                description: `Check-in: ${checkInDate.toLocaleDateString()} - Check-out: ${checkOutDate.toLocaleDateString()}`,
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
      booking.stripeSessionId = stripeSession.id;
      await booking.save();
    } catch (stripeError) {
      console.error('Error creating Stripe session:', stripeError);
      // Continue without payment for now, but log the error
    }

    // Populate booking details for response
    await booking.populate('roomType', 'room_name price area images');
    await booking.populate('roomInstances', 'room_number');
    await booking.populate('client', 'fullName email phone');

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        roomType: booking.roomType,
        roomNumbers: booking.roomInstances.map(r => r.room_number),
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        adults: booking.adults,
        children: booking.children,
        roomsBooked: booking.roomsBooked,
        numberOfNights: booking.numberOfNights,
        pricePerNight: booking.pricePerNight,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        created_at: booking.created_at
      },
      payment: stripeSession ? {
        sessionId: stripeSession.id,
        url: stripeSession.url
      } : null
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

// Get User's Bookings
const getMyBookings = async (req, res) => {
  try {
    const clientId = req.client._id;

    const bookings = await Booking.find({ 
      client: clientId 
    })
    .populate('roomType', 'room_name price area images')
    .populate('roomInstances', 'room_number')
    .sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching bookings', 
      error: error.message 
    });
  }
};

// Get Single Booking Details
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.client._id;

    const booking = await Booking.findOne({
      _id: id,
      client: clientId
    })
    .populate('roomType')
    .populate('roomInstances')
    .populate('client', 'fullName email phone');

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    return res.status(200).json({
      success: true,
      booking
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error fetching booking details', 
      error: error.message 
    });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.client._id;

    const booking = await Booking.findOne({
      _id: id,
      client: clientId
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        success: false,
        message: 'Booking is already cancelled' 
      });
    }

    if (booking.status === 'checked-out') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel completed booking' 
      });
    }

    // Check cancellation policy (e.g., 24 hours before check-in)
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursDiff = (checkIn - now) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot cancel booking less than 24 hours before check-in' 
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.updated_at = Date.now();
    await booking.save();

    // Free up room instances
    await RoomInstance.updateMany(
      { _id: { $in: booking.roomInstances } },
      { occupancy_status: 'available' }
    );

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error cancelling booking', 
      error: error.message 
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { sessionId, paymentStatus } = req.body;
    const clientId = req.client._id;

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

    if (booking.paymentStatus === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment status already updated'
      });
    }

    // Update payment status
    booking.paymentStatus = paymentStatus;
    if (paymentStatus === 'paid') {
      booking.paymentDate = new Date();
    }
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      booking
    });

  } catch (error) {
    console.error('Error updating payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

export { checkAvailability, createBooking, getMyBookings, getBookingById, cancelBooking, updatePaymentStatus };