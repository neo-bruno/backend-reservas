const jwt = require('jsonwebtoken')
const authModel = require('../models/auth.models')
const authService = require('../services/auth.service')

// ⚙️ Configuración JWT
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey'

const createToken = (user) => {
  return jwt.sign(
    { id_usuario: user.id_usuario, nombre: user.nombre_usuario, telefono: user.telefono_usuario },
    SECRET_KEY,
    { expiresIn: '7d' }
  )
}

module.exports = {
  // se olvido el password
  async forgotPassword(req, res) {
    try {
      const { email_usuario } = req.body
      await authService.forgotPassword(email_usuario)

      // respuesta SIEMPRE genérica
      res.status(200).json({
        message: 'Si el correo existe, se enviará un enlace de recuperación'
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error interno' })
    }
  },

  // restaurar la contreseña
  async resetPassword(req, res) {
    try {      
      const { token, password } = req.body
      await authService.resetPassword(token, password)

      res.status(200).json({
        message: 'Contraseña actualizada correctamente'
      })
    } catch (error) {
      res.status(400).json({
        message: error.message || 'Token inválido o expirado'
      })
    }
  },

  // 🔹 Registro
  async register(req, res) {
    try {
      const { id_rol, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario } = req.body

      const user = await authModel.registerUser({ id_rol, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario })

      // Aquí podrías llamar a tu servicio de envío de WhatsApp
      // sendWhatsAppMessage(user.telefono_usuario, `Tu código de verificación es ${user.codigo_verificacion}`)

      res.json({ message: 'Usuario registrado. Código enviado por WhatsApp', user })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Verificar código
  async verify(req, res) {
    try {
      const { telefono_usuario, codigo_verify_usuario } = req.body
      await authModel.verifyCode(telefono_usuario, codigo_verify_usuario)
      res.json({ message: 'Usuario verificado correctamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Login
  async login(req, res) {
    try {
      const { telefono_usuario, contrasena_usuario } = req.body
      const user = await authModel.loginUser(telefono_usuario, contrasena_usuario)
      const token = createToken(user)
      res.json({ message: 'Inicio de sesión exitoso', token, user })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Enviar código de recuperación
  async recover(req, res) {
    try {
      const { telefono_usuario } = req.body
      const result = await authModel.sendRecoveryCode(telefono_usuario)

      // Aquí también puedes enviar el código por WhatsApp
      // sendWhatsAppMessage(result.telefono_usuario, `Tu código de recuperación es ${result.codigo_verificacion}`)

      res.json({ message: 'Código de recuperación enviado por WhatsApp' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Resetear contraseña
  async reset(req, res) {
    try {
      const { telefono_usuario, codigo_verify_usuario, nueva_contrasena_usuario } = req.body
      await authModel.resetPassword(telefono_usuario, codigo_verify_usuario, nueva_contrasena_usuario)
      res.json({ message: 'Contraseña actualizada correctamente' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Enviar codigo al telefono whatsapp, para el registro
  async enviarCodigoWhatsApp(req, res) {
    try {
      const { telefono } = req.body
      const data = await authModel.sendCodeRegister(telefono)
      res.json({ ok: true, data })
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message })
    }
  },
}
