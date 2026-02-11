const db = require('./../../config/bd')
const Twilio = require('twilio')
const bcrypt = requer('bcrypt')

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

async function enviarOTP(telefono_otp) {
  const codigo = generarCodigo()

  await db.query(
    `INSERT INTO otp (telefono_usuario, codigo_otp) VALUES ($1, $2)`,
    [telefono_otp, codigo]
  )

  // Enviar por WhatsApp o SMS
  const verification = await client.messages.create({
    from: 'whatsapp:+14155238886', // tu número Twilio WhatsApp
    to: `whatsapp:${telefono}`,
    body: `Tu código de verificación es: ${codigo}`
  });

  return verification.sid;
}

async function verificarOTP(telefono, codigo) {
  const { rows } = await db.query(
    `SELECT * FROM otp_whatsapp 
     WHERE telefono_usuario=$1 AND codigo_otp=$2 AND usado=false
     ORDER BY fecha_envio DESC
     LIMIT 1`,
    [telefono, codigo]
  );

  if (rows.length === 0) return false; // código incorrecto o ya usado

  // marcar OTP como usado
  await db.query(
    `UPDATE otp_whatsapp SET usado=true WHERE id_otp=$1`,
    [rows[0].id_otp]
  );

  return true;
}

async function registrarUsuario({ nombre, telefono, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await db.query(
    `INSERT INTO usuario (nombre_usuario, telefono_usuario, password_usuario)
     VALUES ($1, $2, $3)
     RETURNING id_usuario, nombre_usuario, telefono_usuario`,
    [nombre, telefono, hashedPassword]
  );

  return rows[0];
}

module.exports = {
  enviarOTP,
  verificarOTP,
  registrarUsuario  
}