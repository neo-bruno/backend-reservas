const db = require('../../config/bd')

const saveImageModel = async ({id_habitacion, id_negocio, url_imagen, nombre_imagen}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertImage = await client.query(
      `
      INSERT INTO public.imagen(
      id_habitacion, id_negocio, url_imagen, nombre_imagen)
      VALUES ($1, $2, $3, $4) RETURNING *;
      `,
      [id_habitacion, id_negocio, url_imagen, nombre_imagen]
    )

    await client.query('COMMIT')

    return {
      ...insertImage.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
const getImagesModel = async () => {
  try {
    const query = {
      text: `
         SELECT * FROM imagen ORDER BY id_imagen
      `,
    }    
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las imagenes:', error)
    throw error
  }
}

const getImageModel = async (id_imagen) => {
  try {
    const query = {
      text: `
         SELECT * FROM imagen WHERE id_imagen = $1 ORDER BY id_imagen
      `,
      values: [id_imagen]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener la imagen:', error)
    throw error
  }
}

const modifyImageModel = async ({id_imagen, id_habitacion, id_negocio, url_imagen, nombre_imagen}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertImage = await client.query(
      `
      UPDATE public.imagen
      SET id_habitacion=$2, id_negocio=$3, url_imagen=$4, nombre_imagen=$5
      WHERE id_imagen=$1 RETURNING *;
      `,
      [id_imagen, id_habitacion, id_negocio, url_imagen, nombre_imagen]
    )

    await client.query('COMMIT')

    return {
      ...insertImage.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  saveImageModel,
  getImagesModel,
  getImageModel,
  modifyImageModel,
}