const db = require('../../config/bd')

const getFlujosModel = async (id_caja) => {
  try {
    const query = {
      text: `
        select * from flujo where id_caja = $1 order by id_flujo desc
      `,
      values: [id_caja]
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los flujos:', error)
    throw error
  }
}

const getFlujoModel = async (id_flujo) => {
  try {
    const query = {
      text: `
        select * from flujo where id_flujo = $1 order by id_flujo desc limit 1
      `,
      values: [id_flujo]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los flujos:', error)
    throw error
  }
}

const saveFlujoModel = async (data) => {
  const client = await db.connect()
  try {
    const { id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo } = data
    await client.query('BEGIN')

    // 1. guardar en la base de datos la comanda
    const insertFlujo = await client.query(
      `
      INSERT INTO public.flujo(
      id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo]
    )
    
    await client.query('COMMIT')

    return {
      ...insertFlujo.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyFlujoModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_flujo, id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo
    } = data
    await client.query('BEGIN')

    // 1. guardar en la base de datos la comanda
    const insertFlujo = await client.query(
      `
      UPDATE public.flujo
      SET id_caja=$2, fecha_flujo=$3, tipo_flujo=$4, concepto_flujo=$5, referencia_flujo=$6, monto_flujo=$7, observacion_flujo=$8, estado_flujo=$9
      WHERE id_flujo=$1 RETURNING *;
      `,
      [id_flujo, id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo]
    )
    
    await client.query('COMMIT')

    return {
      ...insertFlujo.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const deleteFlujomodel = async (id_flujo) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    // 🔥 1. obtener movimientos
    const { rows: movimientos } = await client.query(
      `
      DELETE FROM public.flujo
	    WHERE id_flujo = $1;
      `,
      [id_flujo]
    )    

    await client.query('COMMIT')

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {  
  saveFlujoModel,
  getFlujosModel,
  getFlujoModel,
  deleteFlujomodel,
  modifyFlujoModel
}