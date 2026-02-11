const db = require('../../config/bd')

const saveCategoryModel = async ({ nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertCategory = await client.query(
      ` 
      INSERT INTO public.categoria(
      nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
        `,
      [ nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria ]
    )

    await client.query('COMMIT')

    return {
      ...insertCategory.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getCategoriesModel = async () => {
  try {
    const query = {
      text: `
         SELECT * FROM categoria ORDER BY id_categoria
      `,
    }    
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos las categorias:', error)
    throw error
  }
}

const getCategoryModel = async (id_categoria) => {
  try {
    const query = {
      text: `
         SELECT * FROM categoria WHERE id_categoria = $1 ORDER BY id_categoria
      `,
      values: [id_categoria]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener la categoria:', error)
    throw error
  }
}

const modifyCategoryModel = async ({id_categoria, nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertCategory = await client.query(
      `
      UPDATE public.categoria
      SET nombre_categoria=$2, descripcion_categoria=$3, precio_ahora_categoria=$4, precio_antes_categoria=$5, descuento_categoria=$6, cant_noches_categoria=$7
      WHERE id_categoria=$1 RETURNING *;
      `,
      [ id_categoria, nombre_categoria, descripcion_categoria, precio_ahora_categoria, precio_antes_categoria, descuento_categoria, cant_noches_categoria ]
    )

    await client.query('COMMIT')

    return {
      ...insertCategory.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  saveCategoryModel,
  getCategoriesModel,
  getCategoryModel,
  modifyCategoryModel,
}