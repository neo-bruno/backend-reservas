const axios = require('axios')

const enviarSMS = async (telefono, mensaje) => {
  try {
    const response = await axios.post(
      process.env.SMS_API_URL,
      {
        to: telefono,
        message: mensaje,
        api_key: process.env.SMS_API_KEY
      }
    )

    return response.data
  } catch (error) {
    console.error('[SMS ERROR]', error.response?.data || error.message)
    throw new Error('No se pudo enviar SMS')
  }
}

module.exports = { enviarSMS }
