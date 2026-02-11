const admin = require('../services/firebase.service');

// Enviar OTP
const sendOtpController = async (req, res) => {
  try {
    const { telefono } = req.body;
    if (!telefono) return res.status(400).json({ error: 'Teléfono requerido' });

    // Normalizar número
    let phoneNumber = telefono.replace(/\D/g, '');
    if (!phoneNumber.startsWith('591')) phoneNumber = '591' + phoneNumber;
    phoneNumber = '+' + phoneNumber;

    // Crear enlace de verificación temporal (OTP)
    const session = await admin.auth().createSessionCookie(phoneNumber, { expiresIn: 5 * 60 * 1000 });
    
    // ✅ Aquí Firebase envía el SMS al teléfono automáticamente
    res.json({
      ok: true,
      mensaje: 'OTP enviado al teléfono',
      session,      
    });

  } catch (error) {
    console.error('[ERROR] sendOtpController:', error);
    res.status(500).json({ error: error.message });
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Firebase verifica el OTP automáticamente
    const verified = await admin.auth().verifyIdToken(otp);

    if (!verified) return res.status(400).json({ error: 'OTP inválido o expirado' });

    // ✅ Aquí ya sabes que el usuario verificó el teléfono
    res.json({ ok: true, mensaje: 'OTP verificado' });
    
  } catch (error) {
    console.error('[ERROR] verifyOtpController:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { sendOtpController, verifyOtpController};
