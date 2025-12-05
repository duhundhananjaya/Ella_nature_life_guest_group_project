import Booking from '../models/Booking.js';
import Client from '../models/Client.js';
import Room from '../models/Room.js';
import RoomInstance from '../models/RoomInstance.js';
import bcrypt from 'bcryptjs';
import sendTelegramMessage from '../utils/sendTelegramMessage.js';

// Create Receptionist Booking (Manual Booking)
const createReceptionistBooking = async (req, res) => {
  try {
    const { 
      clientData,
      roomTypeId, 
      checkIn, 
      checkOut, 
      adults, 
      children, 
      roomsBooked,
      totalPrice,
      specialRequests,
      paymentMethod,
      paymentStatus,
      advancePayment
    } = req.body;

    // Validate input
    if (!clientData || !roomTypeId || !checkIn || !checkOut || !adults || roomsBooked === undefined || !totalPrice) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }

    // Validate client data
    if (!clientData.fullName || !clientData.email || !clientData.phone || !clientData.country) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide complete client information' 
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

    // Check if client exists by email
    let client = await Client.findOne({ email: clientData.email.toLowerCase().trim() });

    if (!client) {
      // Create new client if doesn't exist
      // Generate a random password for walk-in clients
      const randomPassword = Math.random().toString(36).slice(-8);
      
      // Generate username from email
      const username = clientData.email.split('@')[0] + Math.floor(Math.random() * 1000);

      client = new Client({
        fullName: clientData.fullName,
        email: clientData.email.toLowerCase().trim(),
        phone: clientData.phone,
        country: clientData.country,
        username: username,
        password: randomPassword,
        isEmailVerified: false, // Walk-in clients may not have verified email
        role: 'client'
      });

      await client.save();
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

    // Create booking with RB prefix (Receptionist Booking)
    const booking = new Booking({
      client: client._id,
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
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'cash',
      advancePayment: advancePayment ? parseFloat(advancePayment) : 0,
      isManualBooking: true // Flag to identify manual bookings
    });

    // Override the bookingId to use RB prefix
    const count = await Booking.countDocuments({ isManualBooking: true });
    booking.bookingId = `RB${Date.now()}${String(count + 1).padStart(4, '0')}`;

    await booking.save();

    // Send Telegram notification
    await sendTelegramMessage(
      `📢 <b>Manual Booking Created by Reception!</b>\n\n` +
      `🏨 Room Type: ${roomType.room_name}\n` +
      `🛏 Rooms Booked: ${roomsBooked}\n` +
      `👤 Client: ${clientData.fullName}\n` +
      `📧 Email: ${clientData.email}\n` +
      `📞 Phone: ${clientData.phone}\n` +
      `📅 Check-in: ${checkIn}\n` +
      `📅 Check-out: ${checkOut}\n` +
      `💵 Total: Rs. ${totalPrice}\n` +
      `💳 Payment Method: ${paymentMethod}\n` +
      `📋 Payment Status: ${paymentStatus}`
    );

    // Update room instances status to reserved
    await RoomInstance.updateMany(
      { _id: { $in: selectedRooms.map(r => r._id) } },
      { occupancy_status: 'reserved' }
    );

    // Populate booking details for response
    await booking.populate('roomType', 'room_name price area images');
    await booking.populate('roomInstances', 'room_number');
    await booking.populate('client', 'fullName email phone country');

    return res.status(201).json({
      success: true,
      message: 'Manual booking created successfully',
      booking: {
        _id: booking._id,
        bookingId: booking.bookingId,
        client: {
          fullName: booking.client.fullName,
          email: booking.client.email,
          phone: booking.client.phone,
          country: booking.client.country
        },
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
        paymentMethod: booking.paymentMethod,
        advancePayment: booking.advancePayment,
        created_at: booking.created_at
      }
    });

  } catch (error) {
    console.error('Receptionist booking creation error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error creating booking', 
      error: error.message 
    });
  }
};

export { createReceptionistBooking };