import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  roomType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomInstances: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RoomInstance'
  }],
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  roomsBooked: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true
  },
  numberOfNights: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'refunded'],
    default: 'pending'
  },
<<<<<<< Updated upstream
=======
  // New fields for receptionist bookings
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'bank_transfer', 'check', 'online'],
    default: 'online'
  },
  advancePayment: {
    type: Number,
    default: 0
  },
  isManualBooking: {
    type: Boolean,
    default: false
  },
  // Stripe fields (for online bookings)
  stripeSessionId: {
    type: String
  },
  paymentIntentId: {
    type: String
  },
  paymentDate: {
    type: Date
  },
>>>>>>> Stashed changes
  specialRequests: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Generate booking ID before saving
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    // For manual bookings, use RB prefix
    if (this.isManualBooking) {
      const count = await this.constructor.countDocuments({ isManualBooking: true });
      this.bookingId = `RB${Date.now()}${String(count + 1).padStart(4, '0')}`;
    } else {
      // For online bookings, use BK prefix
      const count = await this.constructor.countDocuments({ isManualBooking: false });
      this.bookingId = `BK${Date.now()}${String(count + 1).padStart(4, '0')}`;
    }
  }
  this.updated_at = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;