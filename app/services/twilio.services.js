const twilio = require('twilio');
const db = require('../../config/bd');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const OTP_EXP_MINUTES = process.env.OTP_EXP_MINUTES || 5;

// Generar OTP de 4 dígitos
function generarCodigoOTP(length = 4) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, '0');
}

// Enviar OTP
async function enviarOTP(telefono, isSandbox = true) {
  // Normalizar teléfono
  telefono = telefono.replace(/\D/g, '');
  if (!telefono.startsWith('591')) telefono = '591' + telefono;
  const telefonoDB = '+' + telefono;

  const codigo = generarCodigoOTP(4);

  // Guardar en DB
  await db.query(`
    INSERT INTO otp (telefono_otp, codigo_otp, usado_otp, fecha_creacion_otp)
    VALUES ($1, $2, false, NOW())
    ON CONFLICT (telefono_otp)
    DO UPDATE SET codigo_otp = EXCLUDED.codigo_otp,
                  usado_otp = false,
                  fecha_creacion_otp = NOW()
  `, [telefonoDB, codigo]);

  const toNumber = `whatsapp:${telefonoDB}`;

  console.log('[DEBUG] Enviando OTP desde:', FROM_NUMBER, 'a:', toNumber);

  try {
    const message = await client.messages.create({
      from: FROM_NUMBER,
      to: toNumber,
      body: `Tu código de verificación es: ${codigo}`
    });
    console.log('[DEBUG] OTP enviado, SID:', message.sid);
    return { ok: true, codigo };
  } catch (error) {
    console.error('[ERROR] No se pudo enviar OTP:', error);
    return { ok: false, error: error.message };
  }
}

module.exports = { enviarOTP, generarCodigoOTP, OTP_EXP_MINUTES };
