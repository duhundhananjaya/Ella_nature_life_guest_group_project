import AttendantTelegramSettings from '../models/AttendantTelegramSettings.js';
import axios from 'axios';

// Get current attendant's Telegram settings
const getAttendantTelegramSettings = async (req, res) => {
  try {
    const attendantId = req.user._id; // From auth middleware

    let settings = await AttendantTelegramSettings.findOne({ attendant_id: attendantId });
    
    if (!settings) {
      return res.status(200).json({
        success: true,
        settings: null,
        message: 'No Telegram settings configured yet'
      });
    }

    return res.status(200).json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching attendant telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching telegram settings',
      error: error.message
    });
  }
};

// Update or Create Attendant's Telegram Settings
const updateAttendantTelegramSettings = async (req, res) => {
  try {
    const attendantId = req.user._id;
    const attendantName = req.user.name;
    const attendantEmail = req.user.email;
    const { bot_token, chat_id, is_active } = req.body;

    // Validate input
    if (!bot_token || !chat_id) {
      return res.status(400).json({
        success: false,
        message: 'Bot Token and Chat ID are required'
      });
    }

    // Validate bot token format
    if (!bot_token.includes(':')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bot token format. Should be like: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
      });
    }

    // Check if settings already exist for this attendant
    let settings = await AttendantTelegramSettings.findOne({ attendant_id: attendantId });

    if (settings) {
      // Update existing settings
      settings.bot_token = bot_token;
      settings.chat_id = chat_id;
      settings.attendant_name = attendantName;
      settings.attendant_email = attendantEmail;
      settings.is_active = is_active !== undefined ? is_active : settings.is_active;
      settings.updated_at = Date.now();
      await settings.save();

      return res.status(200).json({
        success: true,
        message: 'Telegram settings updated successfully',
        settings
      });
    } else {
      // Create new settings
      settings = new AttendantTelegramSettings({
        attendant_id: attendantId,
        attendant_name: attendantName,
        attendant_email: attendantEmail,
        bot_token,
        chat_id,
        is_active: is_active !== undefined ? is_active : true
      });
      await settings.save();

      return res.status(201).json({
        success: true,
        message: 'Telegram settings created successfully',
        settings
      });
    }
  } catch (error) {
    console.error('Error updating attendant telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating telegram settings',
      error: error.message
    });
  }
};

// Test Attendant's Telegram Notification
const testAttendantTelegramNotification = async (req, res) => {
  try {
    const attendantId = req.user._id;
    const settings = await AttendantTelegramSettings.findOne({ attendant_id: attendantId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Please save your Telegram settings first'
      });
    }

    const testMessage = `✅ <b>Test Notification</b>\n\n` +
      `Hello ${settings.attendant_name}!\n\n` +
      `Your Telegram bot is working correctly!\n\n` +
      `You will receive room cleaning alerts when guests check out.\n\n` +
      `<i>Sent at ${new Date().toLocaleString()}</i>`;

    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${settings.bot_token}/sendMessage`,
        {
          chat_id: settings.chat_id,
          text: testMessage,
          parse_mode: 'HTML'
        }
      );

      if (response.data.ok) {
        return res.status(200).json({
          success: true,
          message: 'Test notification sent successfully! Check your Telegram.'
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Failed to send notification. Please check your Bot Token and Chat ID.'
        });
      }
    } catch (telegramError) {
      console.error('Telegram API error:', telegramError.response?.data || telegramError.message);
      return res.status(400).json({
        success: false,
        message: telegramError.response?.data?.description || 'Invalid Bot Token or Chat ID. Please verify your credentials.'
      });
    }
  } catch (error) {
    console.error('Error testing attendant telegram notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Error testing notification',
      error: error.message
    });
  }
};

// Delete Attendant's Telegram Settings
const deleteAttendantTelegramSettings = async (req, res) => {
  try {
    const attendantId = req.user._id;
    const settings = await AttendantTelegramSettings.findOne({ attendant_id: attendantId });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No settings found to delete'
      });
    }

    await AttendantTelegramSettings.deleteOne({ _id: settings._id });

    return res.status(200).json({
      success: true,
      message: 'Telegram settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting attendant telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting telegram settings',
      error: error.message
    });
  }
};

// ============================================
// UTILITY FUNCTION - Send Room Cleaning Alert to ALL Active Attendants
// ============================================
const sendRoomCleaningAlert = async (roomNumbers) => {
  try {
    // Validate room numbers
    if (!roomNumbers || roomNumbers.length === 0) {
      console.log('No room numbers provided for cleaning alert');
      return;
    }

    // Get all active attendant telegram settings
    const activeAttendants = await AttendantTelegramSettings.find({ is_active: true });

    if (activeAttendants.length === 0) {
      console.log('No active attendant telegram bots found');
      return;
    }

    // Format room numbers for display
    const roomNumbersList = Array.isArray(roomNumbers) 
      ? roomNumbers.join(', ') 
      : roomNumbers;

    // Simple cleaning alert message - NO booking details
    const message = `🧹 <b>ROOM CLEANING REQUIRED</b>\n\n` +
      `<b>Room(s):</b> ${roomNumbersList}\n\n` +
      `The room(s) are now dirty and need to be cleaned.\n` +
      `Please clean as soon as possible.\n\n` +
      `<i>Alert sent at ${new Date().toLocaleString()}</i>`;

    // Send to all active attendants
    const sendPromises = activeAttendants.map(async (attendant) => {
      try {
        const response = await axios.post(
          `https://api.telegram.org/bot${attendant.bot_token}/sendMessage`,
          {
            chat_id: attendant.chat_id,
            text: message,
            parse_mode: 'HTML'
          }
        );

        if (response.data.ok) {
          console.log(`✅ Cleaning alert sent to ${attendant.attendant_name} for room(s): ${roomNumbersList}`);
        } else {
          console.error(`❌ Failed to send to ${attendant.attendant_name}`);
        }
      } catch (error) {
        console.error(`❌ Error sending to ${attendant.attendant_name}:`, error.message);
      }
    });

    await Promise.allSettled(sendPromises);
    console.log(`Room cleaning alerts sent for room(s): ${roomNumbersList}`);
  } catch (error) {
    console.error('Error sending room cleaning alerts:', error);
  }
};

export { 
  getAttendantTelegramSettings, 
  updateAttendantTelegramSettings, 
  testAttendantTelegramNotification,
  deleteAttendantTelegramSettings,
  sendRoomCleaningAlert 
};