import mongoose from "mongoose";

const attendantTelegramSettingsSchema = new mongoose.Schema({
  attendant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each attendant can have only one bot configuration
  },
  attendant_name: {
    type: String,
    required: true
  },
  attendant_email: {
    type: String,
    required: true
  },
  bot_token: {
    type: String,
    required: true
  },
  chat_id: {
    type: String,
    required: true
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

const AttendantTelegramSettings = mongoose.model("AttendantTelegramSettings", attendantTelegramSettingsSchema);
export default AttendantTelegramSettings;