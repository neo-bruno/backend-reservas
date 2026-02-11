const db = require('../../config/bd')

const saveLevelModel = async ({nombre_nivel, descripcion_nivel, icono_nivel}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertLevel = await client.query(
      `
      INSERT INTO public.nivel(
      nombre_nivel, descripcion_nivel, icono_nivel)
      VALUES ($1, $2, $3) RETURNING *;
      `,
      [nombre_nivel, descripcion_nivel, icono_nivel]
    )

    await client.query('COMMIT')

    return {
      ...insertLevel.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
const getLevelsModel = async () => {
  try {
    const query = {
      text: `
         SELECT * FROM nivel ORDER BY id_nivel
      `,
    }    
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos los nivel:', error)
    throw error
  }
}

const getLevelModel = async (id_nivel) => {
  try {
    const query = {
      text: `
         SELECT * FROM nivel WHERE id_nivel = $1 ORDER BY id_nivel
      `,
      values: [id_nivel]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el nivel:', error)
    throw error
  }
}

const modifyLevelModel = async ({id_nivel, nombre_nivel, descripcion_nivel, icono_nivel}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertLevel = await client.query(
      `
      UPDATE public.nivel
      SET nombre_nivel=$2, descripcion_nivel=$3, icono_nivel=$4
      WHERE id_nivel=$1 RETURNING *;
      `,
      [id_nivel, nombre_nivel, descripcion_nivel, icono_nivel]
    )

    await client.query('COMMIT')

    return {
      ...insertLevel.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  saveLevelModel,
  getLevelsModel,
  getLevelModel,
  modifyLevelModel,
}