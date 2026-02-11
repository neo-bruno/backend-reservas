const axios = require('axios');

const GREEN_API_URL = process.env.GREEN_API_URL; // https://7107.api.greenapi.com
const INSTANCE_ID = process.env.GREEN_API_ID;
const TOKEN = process.env.GREEN_API_TOKEN;

const sendWhatsApp = async (phone, message) => {
  try {
    const url = `${GREEN_API_URL}/waInstance${INSTANCE_ID}/SendMessage/${TOKEN}`;
    console.log(phone, message)
    const response = await axios.post(url, {
      chatId: `${phone}@c.us`,
      message
    });

    console.log('Respuesta GREEN-API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al enviar WhatsApp:', error.response?.data || error.message);
    throw error;
  }
};

module.exports = { sendWhatsApp };
