const db = require('../../config/bd')

const createUser = async ({ id_rol, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    const personaResult = await client.query(
      `
      INSERT INTO public.persona(
      nombre_persona, documento_persona, expedicion_persona, fecha_nacimiento, nit_persona, razon_social_persona, telefono_persona, tipo_persona)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [nombre_usuario, '', '', null, '', '', telefono_usuario, 1]      
    )
    const Persona = personaResult.rows[0]
    
    // 1. Guardar seccion
    const usuarioResult = await client.query(
      `
      INSERT INTO public.usuario(
      id_rol, id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
       `,
      [ id_rol, Persona.id_persona, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario]
    )
    const UsuarioRegistrado = usuarioResult.rows[0]

    await client.query('COMMIT')
    return { UsuarioRegistrado }
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
            u.nombre_usuario,            
            u.telefono_usuario,
            u.codigo_pais_usuario,
            u.contrasena_usuario,
            u.verificado_usuario,
            u.codigo_verify_usuario,
            u.fecha_codigo_usuario,
            u.fecha_creacion_usuario,

            json_build_object(
                'id_persona', p.id_persona,
                'nombre_persona', p.nombre_persona,
                'documento_persona', p.documento_persona,
                'expedicion_persona', p.expedicion_persona,
                'fecha_nacimiento', p.fecha_nacimiento,
                'razon_social_persona', p.razon_social_persona,
                'tipo_persona', p.tipo_persona,
                'telefono_persona', p.telefono_persona,
                'fecha_creacion_persona', p.fecha_creacion_persona
            ) AS persona

        FROM usuario u
        LEFT JOIN persona p ON p.id_persona = u.id_persona
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
  findByCellphone,
  getUser,
}