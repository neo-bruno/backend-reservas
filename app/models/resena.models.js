const db = require('../../config/bd')

const saveReviewModel = async ({
  id_habitacion,
  id_usuario,
  puntuacion_resena,
  comentario_resena,
  estado_resena
}) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const insertResena = await client.query(
      `
      INSERT INTO public.resena (
        id_habitacion,
        id_usuario,
        fecha_resena,
        puntuacion_resena,
        comentario_resena,
        estado_resena
      )
      VALUES ($1, $2, NOW(), $3, $4, $5)
      RETURNING *;
      `,
      [
        id_habitacion,
        id_usuario,
        puntuacion_resena,
        comentario_resena,
        estado_resena
      ]
    )

    await client.query('COMMIT')

    return insertResena.rows[0]

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getReviewModel = async (id_habitacion, id_usuario) => {
  try {
    const query = {
      text: `
         select * from resena where id_habitacion = $1 and id_usuario = $2;
      `,
      values: [id_habitacion, id_usuario]
    }
    const { rows } = await db.query(query)
    return rows[0] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos los nivel:', error)
    throw error
  }
}

const getAllReviesModel = async () => {
  try {
    const query = {
      text: `
        select * from resena r, usuario u where r.id_usuario = u.id_usuario   
      `,      
    }
    const { rows } = await db.query(query)
    return rows // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos los nivel:', error)
    throw error
  }
}

const modifyReviewModel = async ({ id_resena, id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos la resena
    const insertResena = await client.query(
      `
      UPDATE public.resena
      SET id_habitacion=$2, id_usuario=$3, fecha_resena=$4, puntuacion_resena=$5, comentario_resena=$6, estado_resena=$7
      WHERE id_resena=$1 RETURNING *;
      `,
      [id_resena, id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena]
    )

    await client.query('COMMIT')

    return {
      ...insertResena.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  saveReviewModel,
  getReviewModel,
  getAllReviesModel,
  modifyReviewModel,
}