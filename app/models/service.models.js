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

module.exports = { saveServiceModel, getServicesModel}