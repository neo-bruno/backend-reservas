const bd = require('../../config/bd')

const saveServiceModel = async ( servicio ) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')
    const { nombre_servicio, icono_servicio } = servicio
    const serviceResult = await client.query(
      `
      INSERT INTO public.servicio(
      nombre_servicio, icono_servicio)
      VALUES ($1, $2) RETURNING *;
      `,
      [ nombre_servicio, icono_servicio ]
    )
    await client.query('COMMIT')
    return { data: serviceResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getServicesModel = async () => {
  try {
    const query = {
      text: `
        select * from servicio 
      `
    }
    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const modifyServiceModel = async ({ id_servicio, nombre_servicio, icono_servicio }) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')
    
    const ServiceResult = await client.query(
      `
      UPDATE public.servicio
      SET nombre_servicio=$2, icono_servicio=$3
      WHERE id_servicio = $1;      
      `,
      [ id_servicio, nombre_servicio, icono_servicio ]
    )
    await client.query('COMMIT')
    return { data: ServiceResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getServiceModel = async (id_servicio) => {
  try {
    const query = {
      text: `
         SELECT * FROM servicio WHERE id_servicio = $1 ORDER BY id_servicio
      `,
      values: [id_servicio]
    }
    const { rows } = await bd.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el nivel:', error)
    throw error
  }
}

module.exports = { saveServiceModel, getServicesModel, modifyServiceModel, getServiceModel}