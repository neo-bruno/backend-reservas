const db = require('../../config/bd')

const saveCajaModel = async (caja) => {
  const client = await db.connect()
  const {
    monto_inicial_caja,
    monto_cuenta_caja,
    monto_ingreso_caja,
    monto_gasto_caja,
    monto_total_caja,
    observacion_caja,
    estado_caja,
    fecha_caja,
    usuario_caja,
    cuentas
  } = caja
  try {
    await client.query('BEGIN')

    // =====================================
    // 1. GUARDAR DATOS DE CAJA
    // =====================================
    const insertCaja = await client.query(
      ` 
      INSERT INTO public.caja(
      monto_inicial_caja, monto_cuenta_caja, monto_ingreso_caja, monto_gasto_caja, monto_total_caja, observacion_caja, estado_caja, fecha_caja)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `,
      [monto_inicial_caja, monto_cuenta_caja, monto_ingreso_caja, monto_gasto_caja, monto_total_caja, observacion_caja, estado_caja, fecha_caja]
    )

    const id_caja = insertCaja.rows[0].id_caja

    // =====================================
    // 2. GUARDAR DATOS DE USUARIO_CAJA
    // =====================================
    await client.query(
      ` 
      INSERT INTO public.usuario_caja(
      id_caja, id_usuario, fecha_apertura_caja, fecha_cierre_caja, estado_usuario_caja)
      VALUES ($1, $2, $3, $4, $5);
        `,
      [id_caja, usuario_caja.id_usuario, usuario_caja.fecha_apertura_caja, usuario_caja.fecha_cierre_caja, usuario_caja.estado_usuario_caja]
    )

    if (Array.isArray(cuentas) && cuentas.length > 0) {
      for (const cuenta of cuentas) {
        await client.query(
          `INSERT INTO public.caja_cuenta(id_cuenta, id_caja)
          VALUES ($1, $2);`,
          [cuenta.id_cuenta, id_caja]
        )
      }
    }

    await client.query('COMMIT')

    return {
      caja: insertCaja.rows[0],
      cuentas: cuentas ?? []
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getCajaActivaModel = async () => {
  try {
    const query = {
      text: `
        SELECT 
          c.id_caja,
          c.monto_inicial_caja,
          c.monto_cuenta_caja,
          c.monto_ingreso_caja,
          c.monto_gasto_caja,
          c.monto_total_caja,
          c.observacion_caja,
          c.estado_caja,
          c.fecha_caja,

          uc.id_usuario_caja,
          uc.fecha_apertura_caja,
          uc.fecha_cierre_caja,
          uc.estado_usuario_caja,

          u.id_usuario,
          u.nombre_usuario,
          u.email_usuario

        FROM caja c
        INNER JOIN usuario_caja uc 
            ON uc.id_caja = c.id_caja
        INNER JOIN usuario u 
            ON u.id_usuario = uc.id_usuario

        WHERE c.estado_caja = 1;
      `,
    }
    const { rows } = await db.query(query)
    return rows[0] || null // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todos las cajas:', error)
    throw error
  }
}

const getCajaModel = async (id_caja) => {
  try {
    const query = {
      text: `
         SELECT 
          cc.id_caja_cuenta,
          cc.id_caja,

          json_build_object(
              'id_cuenta', c.id_cuenta,
              'monto_total', c.monto_total_cuenta,
              'estado', c.estado_cuenta,

              'registro', (
                  SELECT json_build_object(
                      'id_registro', r.id_registro,
                      'fecha', r.fecha_registro,
                      'total', r.total_registro,
                      'estado', r.estado_registro,

                      'recibos', (
                          SELECT COALESCE(json_agg(
                              json_build_object(
                                  'id_recibo', re.id_recibo,
                                  'numero', re.numero_recibo,
                                  'fecha', re.fecha_recibo,
                                  'total', re.total_recibo,
                                  'detalle', (
                                      SELECT COALESCE(json_agg(
                                          json_build_object(
                                              'descripcion', dr.des_detalle_recibo,
                                              'precio', dr.pre_detalle_recibo,
                                              'importe', dr.imp_detalle_recibo
                                          )
                                      ), '[]')
                                      FROM detalle_recibo dr
                                      WHERE dr.id_recibo = re.id_recibo
                                  )
                              )
                          ), '[]')
                          FROM recibo re
                          WHERE re.id_registro = r.id_registro
                      )
                  )
                  FROM registro r
                  WHERE r.id_cuenta = c.id_cuenta
                  LIMIT 1
              ),

              'estadia', (
                  SELECT json_build_object(
                      'id_estadia', e.id_estadia,
                      'fecha_inicio', e.fecha_inicio_estadia,
                      'fecha_fin', e.fecha_final_estadia,
                      'noches', e.noches_estadia,
                      'precio', e.precio_estadia
                  )
                  FROM estadia e
                  WHERE e.id_cuenta = c.id_cuenta
                  LIMIT 1
              ),

              'comandas', (
                  SELECT COALESCE(json_agg(
                      json_build_object(
                          'id_comanda', co.id_comanda,
                          'numero', co.numero_comanda,
                          'fecha', co.fecha_comanda,
                          'total', co.total_comanda,

                          'detalle', (
                              SELECT COALESCE(json_agg(
                                  json_build_object(
                                      'concepto', d.concepto_detalle,
                                      'cantidad', d.cantidad_detalle,
                                      'precio', d.precio_detalle,
                                      'importe', d.importe_detalle
                                  )
                              ), '[]')
                              FROM detalle d
                              WHERE d.id_comanda = co.id_comanda
                          ),

                          'movimientos', (
                              SELECT COALESCE(json_agg(
                                  json_build_object(
                                      'tipo', m.tipo_movimiento,
                                      'fecha', m.fecha_movimiento,
                                      'cantidad', m.cantidad_movimiento,
                                      'monto', m.monto_movimiento
                                  )
                              ), '[]')
                              FROM movimiento m
                              WHERE m.id_comanda = co.id_comanda
                          )
                      )
                  ), '[]')
                  FROM comanda co
                  WHERE co.id_cuenta = c.id_cuenta
              )

          ) AS cuenta

      FROM caja_cuenta cc
      JOIN cuenta c ON c.id_cuenta = cc.id_cuenta

      -- 🔥 AQUÍ EL FILTRO
      WHERE cc.id_caja = $1;
      `,
      values: [id_caja]
    }
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener la caja:', error)
    throw error
  }
}

const modifyCajaModel = async (caja) => {
  const client = await db.connect()
  const {
    id_caja, monto_inicial_caja, monto_cuenta_caja, monto_ingreso_caja, monto_gasto_caja, monto_total_caja, observacion_caja, estado_caja, fecha_caja, usuario_caja
  } = caja
  try {
    await client.query('BEGIN')

    // 1. guardar en la base de datos el nivel
    const insertCategory = await client.query(
      `
      UPDATE public.caja
      SET monto_inicial_caja=$2, monto_cuenta_caja=$3, monto_ingreso_caja=$4, monto_gasto_caja=$5, monto_total_caja=$6, observacion_caja=$7, estado_caja=$8, fecha_caja=$9
      WHERE id_caja=$1;  
      `,
      [id_caja, monto_inicial_caja, monto_cuenta_caja, monto_ingreso_caja, monto_gasto_caja, monto_total_caja, observacion_caja, estado_caja, fecha_caja]
    )

    await client.query(
      `
      UPDATE public.usuario_caja
      SET fecha_cierre_caja=$3, estado_usuario_caja=$4
      WHERE id_caja=$1 and id_usuario=$2;
      `,
      [usuario_caja.id_caja, usuario_caja.id_usuario, usuario_caja.fecha_cierre_caja, usuario_caja.estado_usuario_caja]
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
  saveCajaModel,
  getCajaActivaModel,
  getCajaModel,
  modifyCajaModel,
}