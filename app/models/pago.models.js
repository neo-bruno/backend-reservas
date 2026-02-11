const db = require('../../config/bd')

const savePayModel = async ({id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, estado_pago, url_pago}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertPay = await client.query(
      `
      INSERT INTO public.pago(
      id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) RETURNING *;
      `,
      [id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, estado_pago, url_pago]
    )

    await client.query('COMMIT')

    return {
      ...insertPay.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
const getPaymentsModel = async () => {
  try {
    const query = {
      text: `
         SELECT * FROM pago ORDER BY id_pago
      `,
    }    
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos los pagos:', error)
    throw error
  }
}

const getAllPaymentsBookingModel = async (id_reserva) => {
  try {
    const query = {
      text: `
         SELECT * FROM pago WHERE id_reserva = $1 ORDER BY id_reserva
      `,
      values: [id_reserva]
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener los pagos de la reserva:', error)
    throw error
  }
}

const modifyPayModel = async ({id_pago, id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago}) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const modifyPay = await client.query(
      `
      UPDATE public.pago
      SET id_reserva=$2, monto_pago=$3, tipo_pago=$4, metodo_pago=$5, comision_pago=$6, fecha_pago=$7, estado_pago=$8, url_pago=$9
      WHERE id_pago=$1 RETURNING *;
      `,
      [id_pago, id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago]
    )

    await client.query('COMMIT')

    return {
      ...modifyPay.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  savePayModel,
  getPaymentsModel,
  getAllPaymentsBookingModel,
  modifyPayModel,
}