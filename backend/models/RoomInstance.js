import mongoose from "mongoose";

const roomInstanceSchema = new mongoose.Schema({
  room_number: { 
    type: String, 
    required: true, 
    unique: true // e.g., "101", "102", "201A"
  },
  room_type: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room", 
    required: true 
  },
  cleaning_status: {
    type: String,
    enum: ["clean", "dirty", "in-progress", "inspected"],
    default: "clean"
  },
  maintenance_status: {
    type: String,
    enum: ["good", "needs-repair", "under-maintenance"],
    default: "good"
  },
  occupancy_status: {
    type: String,
    enum: ["available", "occupied", "reserved", "blocked"],
    default: "available"
  },
  last_cleaned_at: { 
    type: Date 
  },
  last_cleaned_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" // Attendant who cleaned
  },
  notes: { 
    type: String // Special notes for this room
  },
  is_active: { 
    type: Boolean, 
    default: true 
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

// Update the updated_at timestamp before saving
roomInstanceSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const RoomInstance = mongoose.model("RoomInstance", roomInstanceSchema);
export default RoomInstance;