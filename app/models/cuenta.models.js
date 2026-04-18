const db = require('../../config/bd')

const getAllAccountsModel = async () => {
  try {
    const query = {
      text: `
        SELECT *
        FROM cuenta WHERE estado_cuenta = 1
        ORDER BY id_cuenta ASC;
      `,
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un arreglo vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los Cuenta:', error)
    throw error
  }
}

const saveAccountModel = async (data) => {
  const client = await db.connect()
  try {
    const {  } = data
    await client.query('BEGIN')
    // 1. guardar en la base de datos el nivel
    const insertKardex = await client.query(
      `
      RETURNING *;
      `,
      []
    )
    // 2. modificar el estado de producto
    await client.query(
      `      
      `,
      []
    )
    await client.query('COMMIT')
    return {
      ...insertKardex.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyAccountModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_cuenta, monto_estadia_cuenta, monto_producto_cuenta, monto_comanda_cuenta, monto_adelanto_cuenta, monto_recibo_cuenta, monto_total_cuenta, estado_cuenta
    } = data

    await client.query('BEGIN')
    const updateAccount = await client.query(
      `
      UPDATE public.cuenta
      SET monto_estadia_cuenta=$2, monto_producto_cuenta=$3, monto_comanda_cuenta=$4, monto_adelanto_cuenta=$5, monto_recibo_cuenta=$6, monto_total_cuenta=$7, estado_cuenta=$8
      WHERE id_cuenta=$1
      RETURNING *;
      `,
      [
        id_cuenta, monto_estadia_cuenta, monto_producto_cuenta, monto_comanda_cuenta, monto_adelanto_cuenta, monto_recibo_cuenta, monto_total_cuenta, estado_cuenta
      ]
    )
    await client.query('COMMIT')
    return {
      ...updateAccount.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  getAllAccountsModel,
  saveAccountModel,
  modifyAccountModel,
}