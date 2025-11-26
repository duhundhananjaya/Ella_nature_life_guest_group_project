import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true // One review per booking
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
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

// Update timestamp on save
reviewSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

reviewSchema.post('save', async function() {
  await updateRoomRating(this.roomType);
});

reviewSchema.post('remove', async function() {
  await updateRoomRating(this.roomType);
});

// Helper function
async function updateRoomRating(roomId) {
  const Review = mongoose.model('Review');
  const Room = mongoose.model('Room');
  
  const stats = await Review.aggregate([
    { $match: { roomType: roomId } },
    {
      $group: {
        _id: '$roomType',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Room.findByIdAndUpdate(roomId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  } else {
    await Room.findByIdAndUpdate(roomId, {
      averageRating: 0,
      totalReviews: 0
    });
  }
}

const Review = mongoose.model('Review', reviewSchema);
export default Review;