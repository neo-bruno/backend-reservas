const db = require('../../config/bd')

const saveReceiptModel = async (dato) => {
  const client = await db.connect()
  try {
    const { id_registro, numero_recibo, fecha_recibo, hora_recibo, logo_recibo, cliente_recibo, concepto_recibo, total_recibo, literal_recibo, responsable_recibo, detalles_recibo, id_cuenta, monto_recibo_cuenta, estadias, comandas, flujo } = dato
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertReceipt = await client.query(
      `
      INSERT INTO public.recibo(
      id_registro, numero_recibo, fecha_recibo, hora_recibo, logo_recibo, cliente_recibo, concepto_recibo, total_recibo, literal_recibo, responsable_recibo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
      `,
      [id_registro, numero_recibo, fecha_recibo, hora_recibo, logo_recibo, cliente_recibo, concepto_recibo, total_recibo, literal_recibo, responsable_recibo]
    )
    const id_recibo = insertReceipt.rows[0].id_recibo

    for (const detalle of detalles_recibo) {
      await client.query(
        `INSERT INTO public.detalle_recibo(
        id_recibo, des_detalle_recibo, ref_detalle_recibo, pre_detalle_recibo, imp_detalle_recibo, est_detalle_recibo, obs_detalle_recibo)
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          id_recibo,
          detalle.des_detalle_recibo,
          detalle.ref_detalle_recibo,
          detalle.pre_detalle_recibo,
          detalle.imp_detalle_recibo,
          detalle.est_detalle_recibo,
          detalle.obs_detalle_recibo
        ]
      )
    }
    
    const monto = Number(monto_recibo_cuenta) + Number(total_recibo)

    await client.query(
      `
      UPDATE public.cuenta
      SET monto_recibo_cuenta=$2
      WHERE id_cuenta=$1;
      `,
      [id_cuenta, monto]
    )

    for (const estadia of estadias) {
      await client.query(
        `UPDATE public.estadia
        SET estado_estadia=$2
        WHERE id_estadia=$1`,
        [
          estadia.id_estadia,
          estadia.estado_estadia
        ]
      )
    }

    for (const comanda of comandas) {
      await client.query(
        `UPDATE public.comanda
        SET estado_comanda=$2
        WHERE id_comanda=$1`,
        [
          comanda.id_comanda,
          comanda.estado_comanda
        ]
      )
    }

    await client.query(
      `
      INSERT INTO public.flujo(
      id_caja, fecha_flujo, tipo_flujo, concepto_flujo, referencia_flujo, monto_flujo, observacion_flujo, estado_flujo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `,
      [flujo.id_caja, flujo.fecha_flujo, flujo.tipo_flujo, flujo.concepto_flujo, flujo.referencia_flujo, flujo.monto_flujo, flujo.observacion_flujo, flujo.estado_flujo]
    )

    await client.query('COMMIT')

    return {
      ...insertReceipt.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getAllReceiptModel = async (id_registro) => {
  try {
    const query = {
      text: `
        SELECT 
          r.id_recibo,
          r.id_registro,
          r.numero_recibo,
          r.fecha_recibo,
          r.hora_recibo,
          r.logo_recibo,
          r.cliente_recibo,
          r.concepto_recibo,
          r.total_recibo,
          r.literal_recibo,
          r.responsable_recibo,

          (
              SELECT COALESCE(
                  json_agg(
                      json_build_object(
                          'id_detalle_recibo', dr.id_detalle_recibo,
                          'des_detalle_recibo', dr.des_detalle_recibo,
                          'ref_detalle_recibo', dr.ref_detalle_recibo,
                          'pre_detalle_recibo', dr.pre_detalle_recibo,
                          'imp_detalle_recibo', dr.imp_detalle_recibo,
                          'est_detalle_recibo', dr.est_detalle_recibo,
                          'obs_detalle_recibo', dr.obs_detalle_recibo
                      )
                  ), '[]'::json
              )
              FROM detalle_recibo dr
              WHERE dr.id_recibo = r.id_recibo
          ) AS detalles_recibo

      FROM recibo r
      WHERE r.id_registro = $1
      ORDER BY r.id_recibo DESC;
      `,
      values: [id_registro]
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas los recibos:', error)
    throw error
  }
}

const getReceiptModel = async (numero_recibo) => {
  try {
    const query = {
      text: `
        SELECT 
          r.id_recibo,
          r.id_registro,
          r.numero_recibo,
          r.fecha_recibo,
          r.hora_recibo,
          r.logo_recibo,
          r.cliente_recibo,
          r.concepto_recibo,
          r.total_recibo,
          r.literal_recibo,
          r.responsable_recibo,

          (
              SELECT COALESCE(
                  json_agg(
                      json_build_object(
                          'id_detalle_recibo', dr.id_detalle_recibo,
                          'des_detalle_recibo', dr.des_detalle_recibo,
                          'ref_detalle_recibo', dr.ref_detalle_recibo,
                          'pre_detalle_recibo', dr.pre_detalle_recibo,
                          'imp_detalle_recibo', dr.imp_detalle_recibo,
                          'est_detalle_recibo', dr.est_detalle_recibo,
                          'obs_detalle_recibo', dr.obs_detalle_recibo
                      )
                  ), '[]'::json
              )
              FROM detalle_recibo dr
              WHERE dr.id_recibo = r.id_recibo
          ) AS detalles_recibo

      FROM recibo r
      WHERE r.numero_recibo = $1
      ORDER BY r.id_recibo DESC;
      `,
      values: [numero_recibo]
    }
    const { rows } = await db.query(query)
    return rows[0] || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el recibo:', error)
    throw error
  }
}

const getLastReceiptModel = async () => {
  try {
    const query = {
      text: `
        select * from recibo order by id_recibo desc limit 1
      `
    }
    const { rows } = await db.query(query)
    return rows[0] || {numero_recibo: 0} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas los recibos:', error)
    throw error
  }
}

module.exports = {
  saveReceiptModel,  
  getLastReceiptModel,
  getAllReceiptModel,  
  getReceiptModel
}