const db = require('../../config/bd')

const createUser = async ({ rol_usuario, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, fecha_creacion_usuario }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
           
    // 1. Guardar seccion
    const usuarioResult = await client.query(
      `
      INSERT INTO public.usuario(
      rol_usuario, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, fecha_creacion_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
       `,
      [rol_usuario, nombre_usuario, telefono_usuario, codigo_pais_usuario, contrasena_usuario, verificado_usuario, fecha_creacion_usuario]
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
        SELECT  *
        FROM usuario
        WHERE telefono_usuario = $1
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