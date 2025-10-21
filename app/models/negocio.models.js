const bd = require('../../config/bd')

const saveBusinessModel = async (negocio) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    const { tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, fecha_creacion } = negocio

    const BusinessResult = await client.query(
      `
      INSERT INTO public.negocio(
      tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, fecha_creacion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `,
      [tipo_negocio, nombre_negocio, ubicacion_negocio, descripcion_negocio, telefono_negocio, estado_negocio, fecha_creacion]
    )

    await client.query('COMMIT')
    return { data: BusinessResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getBusinessModel = async (tipo_negocio) => {
  try {
    const query = {
      text: `
      
    `,
      values: []
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveBusinessModel,
  getBusinessModel
}