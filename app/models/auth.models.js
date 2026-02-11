const axios = require('axios')
const db = require('../../config/bd')
const bcrypt = require('../helpers/bcrypt.helper')

// 🔹 Generar código aleatorio de 4 dígitos
const generarCodigo = () => Math.floor(1000 + Math.random() * 9000).toString()

/**
 * registerUser
 * payload:
 * {
 *   nombre_usuario,
 *   telefono_usuario,
 *   codigo_pais_usuario,
 *   contrasena_usuario,
 *   persona: { nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento, telefono_persona, nit_persona, razon_social_persona, tipo_persona }
 * }
 */
const registerUser = async ({ id_rol, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, persona = {} }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1) verificar si ya existe usuario con ese teléfono
    const existsUser = await client.query(
      `SELECT id_usuario FROM usuario WHERE telefono_usuario = $1 LIMIT 1`,
      [telefono_usuario]
    )
    if (existsUser.rowCount > 0) {
      throw new Error('El teléfono ya está registrado')
    }

    // 2) buscar persona por documento o por teléfono_persona (si se pasó)
    let id_persona = null
    if (persona.documento_persona) {
      const p = await client.query(
        `SELECT id_persona FROM persona WHERE documento_persona = $1 LIMIT 1`,
        [persona.documento_persona]
      )
      if (p.rowCount) id_persona = p.rows[0].id_persona
    }
    if (!id_persona && persona.telefono_persona) {
      const p2 = await client.query(
        `SELECT id_persona FROM persona WHERE telefono_persona = $1 LIMIT 1`,
        [persona.telefono_persona]
      )
      if (p2.rowCount) id_persona = p2.rows[0].id_persona
    }

    // 3) si no existe persona, insertarla
    if (!id_persona) {
      const insertPersona = await client.query(
        `INSERT INTO persona (
           nombre_persona, documento_persona, expedicion_persona,
           fecha_nacimiento_persona, nit_persona, razon_social_persona,
           telefono_persona, tipo_persona
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING id_persona`,
        [
          persona.nombre_persona || nombre_usuario || null,
          persona.documento_persona || null,
          persona.expedicion_persona || null,
          persona.fecha_nacimiento_persona || null,
          persona.nit_persona || null,
          persona.razon_social_persona || null,
          persona.telefono_persona || telefono_usuario,
          persona.tipo_persona || null
        ]
      )
      id_persona = insertPersona.rows[0].id_persona
    }

    // 4) crear usuario con id_persona vinculado
    const hash = await bcrypt.encrypt(contrasena_usuario)
    const codigo = generarCodigo()

    const insertUsuario = await client.query(
      `INSERT INTO usuario (
         id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario,
         contrasena_usuario, verificado_usuario
       ) VALUES ($1,$2,$3,$4,$5,$6,false)
       RETURNING id_usuario, nombre_usuario, telefono_usuario, verificado_usuario`,
      [id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, hash]
    )

    await client.query('COMMIT')

    return {
      id_persona,
      ...insertUsuario.rows[0] // id_usuario, nombre_usuario, telefono_usuario, codigo_verificacion
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// 🔹 Verificar código
const verifyCode = async (telefono, codigo) => {
  const query = `
    SELECT * FROM usuario
    WHERE telefono_usuario=$1
      AND codigo_verify_usuario=$2
      AND fecha_codigo_usuario > NOW() - INTERVAL '3 minutes'
  `
  const result = await db.query(query, [telefono, codigo])
  if (result.rowCount === 0) throw new Error('Código inválido o expirado')

  await db.query(`
    UPDATE usuario
    SET verificado_usuario=true, codigo_verify_usuario=NULL
    WHERE telefono_usuario=$1
  `, [telefono])

  return { success: true }
}

// 🔹 Login
const loginUser = async (telefono, contrasena) => {
  const result = await db.query(`SELECT * FROM usuario WHERE telefono_usuario=$1`, [telefono])
  if (result.rowCount === 0) throw new Error('Usuario no encontrado')

  const user = result.rows[0]
  const match = await bcrypt.compare(contrasena, user.contrasena_usuario)
  if (!match) throw new Error('Contraseña incorrecta')

  if (!user.verificado_usuario) throw new Error('Usuario no verificado')

  return user
}

// 🔹 Enviar código de recuperación
const sendRecoveryCode = async (telefono) => {
  const codigo = generarCodigo()
  const result = await db.query(`
    UPDATE usuario
    SET codigo_verify_usuario=$1, fecha_codigo_usuario=NOW()
    WHERE telefono_usuario=$2
    RETURNING telefono_usuario, codigo_verify_usuario
  `, [codigo, telefono])

  if (result.rowCount === 0) throw new Error('Teléfono no registrado')

  return result.rows[0]
}

const sendCodeRegister = async (telefono) => {
  try {
    const codigo = generarCodigo()

    // 🔹 Normalizar teléfono
    let numeroFinal = telefono.replace(/\D/g, '')
    if (!numeroFinal.startsWith('591')) {
      numeroFinal = '591' + numeroFinal
    }

    // 🔹 Guardar o actualizar OTP (usuario NO necesario)
    await db.query(
      `
      INSERT INTO otp (telefono_otp, codigo_otp) VALUES ($1, $2)
      `,
      [numeroFinal, codigo]
    )

    // 🔹 Green API
    const url = `https://api.green-api.com/waInstance${process.env.GREEN_API_ID}/sendMessage/${process.env.GREEN_API_TOKEN}`

    console.log('📲 Enviando WhatsApp a:', `${numeroFinal}@c.us`)

    // 🔹 Enviar WhatsApp
    await axios.post(url, {
      chatId: `${numeroFinal}@c.us`,
      message: `🔐 Tu código de verificación es: *${codigo}*\n\nVálido por 3 minutos.`,
    })

    console.log(`✅ Código enviado ${codigo} al WhatsApp: ${numeroFinal}`)

    return { codigo: codigo }

  } catch (error) {
    const errorMsg = error.response?.data?.error || error.message

    console.error('❌ Error Green API:', errorMsg)

    // 🎯 Error claro para el frontend
    if (
      errorMsg.includes('not registered') ||
      errorMsg.includes('chat not found')
    ) {
      throw new Error('El número no tiene WhatsApp')
    }

    throw new Error('No se pudo enviar el código de verificación')
  }
}

// 🔹 Resetear contraseña
const resetPassword = async (telefono, codigo, nuevaContrasena) => {
  const result = await db.query(`
    SELECT * FROM usuario
    WHERE telefono_usuario=$1 AND codigo_verify_usuario=$2
      AND fecha_codigo_usuario > NOW() - INTERVAL '10 minutes'
  `, [telefono, codigo])

  if (result.rowCount === 0) throw new Error('Código inválido o expirado')

  const hash = await bcrypt.encrypt(nuevaContrasena)
  await db.query(`
    UPDATE usuario
    SET contrasena_usuario=$1, codigo_verify_usuario=NULL, verificado_usuario=true
    WHERE telefono_usuario=$2
  `, [hash, telefono])
}

module.exports = {
  registerUser,
  verifyCode,
  loginUser,
  sendRecoveryCode,
  resetPassword,
  sendCodeRegister
}
