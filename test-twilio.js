require('dotenv').config()
const twilio = require('twilio')

// Configurar Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSid, authToken)

// Número del sandbox de Twilio
const TWILIO_SANDBOX = 'whatsapp:+14155238886'

// Tu número de prueba (debes haber enviado 'join <código>' al sandbox)
const MI_NUMERO = 'whatsapp:+59173425366'  // cambia a tu número con +591

// Generar OTP de 6 dígitos
const generarCodigoOTP = (length = 6) => {
  return Math.floor( Math.random() * Math.pow(10, length) )
    .toString()
    .padStart(length, '0')
}

// Función para enviar OTP
const enviarOTP = async () => {
  const codigo = generarCodigoOTP(6)
  console.log('[DEBUG] OTP generado:', codigo)

  try {
    const message = await client.messages.create({
      body: `Tu código de verificación es: ${codigo}`,
      from: TWILIO_SANDBOX,
      to: MI_NUMERO
    })

    console.log('[DEBUG] Mensaje enviado con SID:', message.sid)
    console.log('[DEBUG] Revisa tu WhatsApp para recibir el OTP')
  } catch (error) {
    console.error('[ERROR] No se pudo enviar OTP:', error)
  }
}

// Ejecutar
enviarOTP()
