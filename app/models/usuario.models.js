const axios = require('axios')
const db = require('../../config/bd')
require('dotenv').config()

// Genera código aleatorio de 4 dígitos
const generarCodigo = () => Math.floor(1000 + Math.random() * 9000)

const sendRecoveryCode = async (telefono) => {
  try {
    const codigo = generarCodigo()

    // Guardamos el código en la base de datos
    const result = await db.query(
      `UPDATE usuario
       SET codigo_verify_usuario=$1, fecha_codigo_usuario=NOW()
       WHERE telefono_usuario=$2
       RETURNING telefono_usuario, codigo_verify_usuario`,
      [codigo, telefono]
    )

    if (result.rowCount === 0) throw new Error('Teléfono no registrado')

    // Enviar mensaje por WhatsApp con Green-API
    const idInstance = process.env.GREEN_API_ID
    const apiToken = process.env.GREEN_API_TOKEN
    const url = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiToken}`

    // Si el número no tiene prefijo de país, agrégalo (por ejemplo Bolivia = 591)
    let numeroFinal = telefono
    if (!/^(\d{10,15})$/.test(telefono)) {
      numeroFinal = '591' + telefono // <-- ajusta según tu país
    }

    await axios.post(url, {
      chatId: `${numeroFinal}@c.us`,
      message: `🔐 Tu código de verificación es: *${codigo}* \n\nVálido por 3 minutos.`,
    })

    console.log(`✅ Código ${codigo} enviado por WhatsApp a ${numeroFinal}`)
    return { telefono: numeroFinal, codigo }

  } catch (error) {
    console.error('❌ Error al enviar código:', error.message)
    throw new Error('No se pudo enviar el código de verificación.')
  }
}


const createUser = async ({ id_rol, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, email_usuario, verificado_phone_usuario, verificado_email_usuario, metodo_registro_usuario }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    const personaResult = await client.query(
      `
      INSERT INTO public.persona(
      nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento_persona, nit_persona, razon_social_persona, telefono_persona, tipo_persona)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [nombre_usuario, '', '', null, '', '', telefono_usuario, 1]
    )
    const Persona = personaResult.rows[0]

    // 1. Guardar seccion
    const usuarioResult = await client.query(
      `
      INSERT INTO public.usuario(
      id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, email_usuario, verificado_phone_usuario, verificado_email_usuario, metodo_registro_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
       `,
      [id_rol, Persona.id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, email_usuario, verificado_phone_usuario, verificado_email_usuario, metodo_registro_usuario]
    )
    const UsuarioRegistrado = usuarioResult.rows[0]

    await client.query('COMMIT')
    return usuarioResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyUserModel = async ({ id_usuario, id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, email_usuario, verificado_phone_usuario, verificado_email_usuario, metodo_registro_usuario }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    
    const UserResult = await client.query(
      `
      UPDATE public.usuario
      SET id_rol=$2, id_persona=$3, nombre_usuario=$4, telefono_usuario=$5, codigo_pais_usuario=$6, contrasena_usuario=COALESCE($7, contrasena_usuario), verificado_usuario=$8, email_usuario=$9, verificado_phone_usuario=$10, verificado_email_usuario=$11, metodo_registro_usuario=$12
      WHERE id_usuario=$1;
      `,
      [ id_usuario, id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, email_usuario, verificado_phone_usuario, verificado_email_usuario, metodo_registro_usuario ]
    )
    await client.query('COMMIT')
    return { data: UserResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const findByCellphone = async (telefono_usuario) => {
  try {
    const query = {
      text: `
        SELECT 
          u.id_usuario,
          u.id_rol,
          u.id_persona,
          u.nombre_usuario,            
          u.telefono_usuario,
          u.codigo_pais_usuario,
          u.contrasena_usuario,
          u.verificado_usuario,
          u.email_usuario,
          u.verificado_phone_usuario,
          u.verificado_email_usuario,
          u.metodo_registro_usuario,

          json_build_object(
              'id_rol', r.id_rol,
              'nombre_rol', r.nombre_rol
          ) AS rol,

          json_build_object(
              'id_persona', p.id_persona,
              'nombre_persona', p.nombre_persona,
              'documento_persona', p.documento_persona,
              'expedicion_persona', p.expedicion_persona,
              'fecha_nacimiento_persona', p.fecha_nacimiento_persona,
              'razon_social_persona', p.razon_social_persona,
              'tipo_persona', p.tipo_persona,
              'telefono_persona', p.telefono_persona
          ) AS persona

      FROM usuario u
      LEFT JOIN persona p ON p.id_persona = u.id_persona
      LEFT JOIN rol r ON r.id_rol = u.id_rol
      WHERE u.telefono_usuario = $1; -- 👈 parámetro: el número de teléfono del usuario
      `,
      values: [telefono_usuario]
    }

    const { rows } = await db.query(query)
    return rows[0] || { id_usuario: 0, telefono_usuario: '' }  // 👈 Devuelve objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al buscar por teléfono:', error)
    throw error
  }
}

const findEmailUnique = async (email_usuario) => {
  try {
    const query = {
      text: `
        SELECT 
          u.id_usuario,
          u.id_rol,
          u.nombre_usuario,            
          u.telefono_usuario,
          u.codigo_pais_usuario,
          u.contrasena_usuario,
          u.verificado_usuario,

          json_build_object(
              'id_rol', r.id_rol,
              'nombre_rol', r.nombre_rol
          ) AS rol,

          json_build_object(
              'id_persona', p.id_persona,
              'nombre_persona', p.nombre_persona,
              'documento_persona', p.documento_persona,
              'expedicion_persona', p.expedicion_persona,
              'fecha_nacimiento_persona', p.fecha_nacimiento_persona,
              'razon_social_persona', p.razon_social_persona,
              'tipo_persona', p.tipo_persona,
              'telefono_persona', p.telefono_persona
          ) AS persona

      FROM usuario u
      LEFT JOIN persona p ON p.id_persona = u.id_persona
      LEFT JOIN rol r ON r.id_rol = u.id_rol
      WHERE u.email_usuario = $1; -- 👈 parámetro: el número de teléfono del usuario
      `,
      values: [email_usuario]
    }

    const { rows } = await db.query(query)
    return rows[0] || { id_usuario: 0, telefono_usuario: '' }  // 👈 Devuelve objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al buscar por teléfono:', error)
    throw error
  }
}

const getUser = async (id_persona) => {

  const query = {
    text: `      
    `,
    values: [id_persona]
  }
  const { rows } = await db.query(query)
  return rows[0]
}

module.exports = {
  createUser,
  modifyUserModel,
  findByCellphone,
  getUser,
  sendRecoveryCode,
  findEmailUnique,
}