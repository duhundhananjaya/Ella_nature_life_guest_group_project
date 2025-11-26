import mongoose from 'mongoose';

const telegramSettingsSchema = new mongoose.Schema({
  bot_token: {
    type: String,
    required: true,
    trim: true
  },
  chat_id: {
    type: String,
    required: true,
    trim: true
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
telegramSettingsSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

const TelegramSettings = mongoose.model('TelegramSettings', telegramSettingsSchema);

export default TelegramSettings;