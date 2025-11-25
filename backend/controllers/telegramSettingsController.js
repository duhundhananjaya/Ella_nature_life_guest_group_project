import TelegramSettings from '../models/TelegramSettings.js';
import axios from 'axios';

// Get Telegram Settings
const getTelegramSettings = async (req, res) => {
  try {
    let settings = await TelegramSettings.findOne();
    
    if (!settings) {
      // Return empty settings if none exist
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
    console.error('Error fetching telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching telegram settings',
      error: error.message
    });
  }
};

// Update or Create Telegram Settings
const updateTelegramSettings = async (req, res) => {
  try {
    const { bot_token, chat_id, is_active } = req.body;

    // Validate input
    if (!bot_token || !chat_id) {
      return res.status(400).json({
        success: false,
        message: 'Bot Token and Chat ID are required'
      });
    }

    // Validate bot token format (basic check)
    if (!bot_token.includes(':')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bot token format. Should be like: 123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'
      });
    }

    // Check if settings already exist
    let settings = await TelegramSettings.findOne();

    if (settings) {
      // Update existing settings
      settings.bot_token = bot_token;
      settings.chat_id = chat_id;
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
      settings = new TelegramSettings({
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
    console.error('Error updating telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating telegram settings',
      error: error.message
    });
  }
};

// Test Telegram Notification
const testTelegramNotification = async (req, res) => {
  try {
    const settings = await TelegramSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'Please save your Telegram settings first'
      });
    }

    const testMessage = `✅ <b>Test Notification</b>\n\n` +
      `Your Telegram bot is working correctly!\n\n` +
      `You will receive booking alerts from your hotel management system.\n\n` +
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
    console.error('Error testing telegram notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Error testing notification',
      error: error.message
    });
  }
};

// Delete Telegram Settings
const deleteTelegramSettings = async (req, res) => {
  try {
    const settings = await TelegramSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: 'No settings found to delete'
      });
    }

    await TelegramSettings.deleteOne({ _id: settings._id });

    return res.status(200).json({
      success: true,
      message: 'Telegram settings deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting telegram settings:', error);
    return res.status(500).json({
      success: false,
      message: 'Error deleting telegram settings',
      error: error.message
    });
  }
};

export { 
  getTelegramSettings, 
  updateTelegramSettings, 
  testTelegramNotification,
  deleteTelegramSettings 
};