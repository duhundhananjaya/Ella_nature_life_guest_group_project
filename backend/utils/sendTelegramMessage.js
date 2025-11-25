import axios from "axios";
import TelegramSettings from '../models/TelegramSettings.js';

const sendTelegramMessage = async (msg) => {
  try {
    // Fetch settings from database
    const settings = await TelegramSettings.findOne();
    
    // If no settings or not active, skip sending
    if (!settings || !settings.is_active) {
      console.log('Telegram notifications are disabled or not configured');
      return;
    }

    // Send message using stored credentials
    await axios.post(
      `https://api.telegram.org/bot${settings.bot_token}/sendMessage`,
      {
        chat_id: settings.chat_id,
        text: msg,
        parse_mode: "HTML"
      }
    );
    
    console.log('Telegram notification sent successfully');
  } catch (error) {
    console.error("Telegram alert error:", error.message);
    // Don't throw error to prevent breaking the main flow
  }
};

export default sendTelegramMessage;