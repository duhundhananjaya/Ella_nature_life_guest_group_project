import axios from "axios";

const TELEGRAM_BOT_TOKEN = "8456888469:AAGdGwEcIuLY2iy0Axt03uY_YCzlQGRzwE8";
const TELEGRAM_CHAT_ID = "1276275528";

const sendTelegramMessage = async (msg) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: msg,
        parse_mode: "HTML"
      }
    );
  } catch (error) {
    console.error("Telegram alert error:", error.message);
  }
};

export default sendTelegramMessage;
