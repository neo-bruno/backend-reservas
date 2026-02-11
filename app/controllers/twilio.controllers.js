const db = require('../../config/bd');
const bcrypt = require('bcrypt');
const { enviarOTP, OTP_EXP_MINUTES } = require('../services/twilio.services');

// ---------------------------
// 1️⃣ Enviar OTP
// ---------------------------
const sendOtpController = async (req, res) => {
  try {
    const { telefono, isSandbox } = req.body;
    if (!telefono) return res.status(400).json({ error: 'Teléfono requerido' });

    const result = await enviarOTP(telefono, isSandbox ?? true);

    if (!result.ok) return res.status(500).json({ error: result.error });

    res.json({ ok: true, mensaje: 'OTP enviado correctamente' });
  } catch (error) {
    console.error('[ERROR] sendOtpController:', error);
    res.status(500).json({ error: 'Error enviando OTP' });
  }
};

// ---------------------------
// 2️⃣ Verificar OTP y registrar
// ---------------------------
const verifyOtpAndRegisterController = async (req, res) => {
  try {
    let { telefono, codigo, nombre, password } = req.body;
    if (!telefono || !codigo || !nombre || !password) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Normalizar
    telefono = telefono.replace(/\D/g, '');
    if (!telefono.startsWith('591')) telefono = '591' + telefono;
    const telefonoDB = '+' + telefono;

    // Buscar OTP válido
    const { rows } = await db.query(
      `SELECT * FROM otp
       WHERE telefono_otp = $1
         AND codigo_otp = $2
         AND usado_otp = false
         AND fecha_creacion_otp > NOW() - $3 * INTERVAL '1 minute'
       ORDER BY fecha_creacion_otp DESC
       LIMIT 1`,
      [telefonoDB, codigo, OTP_EXP_MINUTES]
    );

    if (!rows.length) return res.status(400).json({ error: 'Código inválido o expirado' });

    // Revisar si usuario ya existe
    const { rowCount } = await db.query(
      `SELECT 1 FROM usuario WHERE telefono_usuario = $1`,
      [telefonoDB]
    );
    if (rowCount) return res.status(409).json({ error: 'Número ya registrado' });

    // Registrar usuario
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows: user } = await db.query(
      `INSERT INTO usuario (nombre_usuario, telefono_usuario, contrasena_usuario)
       VALUES ($1, $2, $3)
       RETURNING id_usuario, nombre_usuario, telefono_usuario`,
      [nombre, telefonoDB, passwordHash]
    );

    // Marcar OTP como usado
    await db.query(`UPDATE otp SET usado_otp = true WHERE id = $1`, [rows[0].id]);

    res.json({ mensaje: 'Usuario registrado correctamente', usuario: user[0] });
  } catch (error) {
    console.error('[ERROR] verifyOtpAndRegisterController:', error);
    res.status(500).json({ error: 'Error verificando OTP' });
  }
};

module.exports = { sendOtpController, verifyOtpAndRegisterController };
