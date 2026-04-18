const db = require('../../config/bd')

const getRegisterModel = async (id_habitacion, estado_registro) => {
  try {
    const query = {
      text: `
      SELECT 
            r.id_registro,
            r.numero_registro,
            r.fecha_registro,
            r.precio_registro::int,
            r.total_registro::int,
            r.estado_registro,
            r.observacion_registro,

            -- HABITACION + CATEGORIA
            json_build_object(
                'id_habitacion', h.id_habitacion,
                'numero_habitacion', h.numero_habitacion,
                'nombre_habitacion', h.nombre_habitacion,
                'adultos_habitacion', h.adultos_habitacion,
                'ninos_habitacion', h.ninos_habitacion,
                'estado_habitacion', h.estado_habitacion,

                'categoria', json_build_object(
                    'id_categoria', cat.id_categoria,
                    'nombre_categoria', cat.nombre_categoria,
                    'descripcion_categoria', cat.descripcion_categoria,
                    'precio_ahora_categoria', cat.precio_ahora_categoria,
                    'precio_antes_categoria', cat.precio_antes_categoria
                )
            ) AS habitacion,

            -- RESTRICCION DEL REGISTRO
            json_build_object(
                'id_restriccion', re.id_restriccion,
                'fecha_inicial_restriccion', re.fecha_inicial_restriccion,
                'hora_inicial_restriccion', re.hora_inicial_restriccion,
                'fecha_final_restriccion', re.fecha_final_restriccion,
                'motivo_restriccion', re.motivo_restriccion
            ) AS restriccion,

            -- RESTRICCIONES DE LA HABITACION
            (
                SELECT COALESCE(
                    json_agg(
                        json_build_object(
                            'id_restriccion', r2.id_restriccion,
                            'fecha_inicial_restriccion', r2.fecha_inicial_restriccion,
                            'fecha_final_restriccion', r2.fecha_final_restriccion,
                            'motivo_restriccion', r2.motivo_restriccion,
                            'estado_restriccion', r2.estado_restriccion
                        )
                    ), '[]'::json
                )
                FROM restriccion r2
                WHERE r2.id_habitacion = h.id_habitacion
                AND r2.estado_restriccion = 1
            ) AS restricciones,

            -- RESERVAS DEL REGISTRO
            (
                SELECT COALESCE(
                    json_agg(
                        json_build_object(
                            'id_reserva', res.id_reserva,
                            'id_restriccion', res.id_restriccion,
                            'codigo_reserva', res.codigo_reserva,
                            'fecha_reserva', res.fecha_reserva,
                            'check_in_reserva', res.check_in_reserva,
                            'check_out_reserva', res.check_out_reserva,
                            'hora_llegada_reserva', res.hora_llegada_reserva,
                            'total_estadia_reserva', res.total_estadia_reserva,
                            'estado_reserva', res.estado_reserva,

                            'pagos', (
                                SELECT COALESCE(
                                    json_agg(
                                        json_build_object(
                                            'id_pago', p.id_pago,
                                            'id_reserva', p.id_reserva,
                                            'monto_pago', p.monto_pago,
                                            'tipo_pago', p.tipo_pago,
                                            'metodo_pago', p.metodo_pago,
                                            'comision_pago', p.comision_pago,
                                            'fecha_pago', p.fecha_pago,
                                            'estado_pago', p.estado_pago,
                                            'url_pago', p.url_pago
                                        )
                                    ), '[]'::json
                                )
                                FROM pago p
                                WHERE p.id_reserva = res.id_reserva
                            )
                        )
                    ), '[]'::json
                )
                FROM registro_reserva rr
                JOIN reserva res ON res.id_reserva = rr.id_reserva
                WHERE rr.id_registro = r.id_registro
            ) AS reservas,

            -- CUENTA
            json_build_object(
                'id_cuenta', c.id_cuenta,
                'monto_estadia_cuenta', c.monto_estadia_cuenta,
                'monto_producto_cuenta', c.monto_producto_cuenta,
                'monto_comanda_cuenta', c.monto_comanda_cuenta,
                'monto_adelanto_cuenta', c.monto_adelanto_cuenta,
                'monto_recibo_cuenta', c.monto_recibo_cuenta,
                'monto_total_cuenta', c.monto_total_cuenta,
                'estado_cuenta', c.estado_cuenta,

                'estadias', (
                  SELECT COALESCE(
                    json_agg(
                      json_build_object(                      
                        'id_estadia', e.id_estadia,
                        'id_cuenta', e.id_cuenta,
                        'fecha_inicio_estadia', e.fecha_inicio_estadia,                        
                        'fecha_final_estadia', e.fecha_final_estadia,
                        'noches_estadia', e.noches_estadia,
                        'precio_estadia', e.precio_estadia,
                        'estado_estadia', e.estado_estadia,
                        'seleccionar_estadia', 1
                      )
                    ), 
                    '[]'::json
                  )
                  FROM estadia e
                  WHERE e.id_cuenta = c.id_cuenta
                ),

                'comandas', (
                    SELECT COALESCE(
                        json_agg(
                            json_build_object(
                                'id_comanda', co.id_comanda,
                                'numero_comanda', co.numero_comanda,
                                'codigo_comanda', co.codigo_comanda,
                                'tipo_comanda', co.tipo_comanda,
                                'total_comanda', co.total_comanda,
                                'estado_comanda', co.estado_comanda,

                                'movimientos', (
                                    SELECT COALESCE(json_agg(m), '[]'::json)
                                    FROM movimiento m
                                    WHERE m.id_comanda = co.id_comanda
                                ),

                                'detalles', (
                                    SELECT COALESCE(json_agg(d), '[]'::json)
                                    FROM detalle d
                                    WHERE d.id_comanda = co.id_comanda
                                )
                            )
                        ), '[]'::json
                    )
                    FROM comanda co
                    WHERE co.id_cuenta = c.id_cuenta
                ),

                'caja_cuenta', (
                    SELECT to_json(cc)
                    FROM caja_cuenta cc
                    WHERE cc.id_cuenta = c.id_cuenta
                    LIMIT 1
                )

            ) AS cuenta

        FROM registro r

        LEFT JOIN habitacion h 
        ON h.id_habitacion = r.id_habitacion

        LEFT JOIN categoria cat
        ON cat.id_categoria = h.id_categoria

        LEFT JOIN restriccion re 
        ON re.id_restriccion = r.id_restriccion

        LEFT JOIN cuenta c 
        ON c.id_cuenta = r.id_cuenta

        WHERE 
            r.id_habitacion = $1
        AND r.estado_registro = $2;
      `,
      values: [id_habitacion, estado_registro]
    }
    const { rows } = await db.query(query)
    return rows[0] || {}
  } catch (error) {
    console.error('error al obtener el registro: ', error)
    throw error
  }
}

const getLastRegisterModel = async () => {
  try {
    const query = {
      text: `
       select * from registro order by id_registro desc limit 1 
      `
    }
    const { rows } = await db.query(query)
    return rows[0] || { numero_registro: 0 }
  } catch (error) {
    console.error('error al obtener el ultimo registro: ', error)
    throw error
  }
}

const saveRegisterManualModel = async (data) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const {
      id_habitacion,      
      estado_habitacion,
      numero_registro,
      precio_registro,
      total_registro,
      estado_registro,
      id_caja,
      cuenta,
      restriccion,
      estadias,
      registro_personas
    } = data

    // =====================================
    // 1️⃣ MODIFICAR HABITACION
    // =====================================
    const habitacionResult = await client.query(
      `
      UPDATE habitacion
      SET        
        estado_habitacion = $2
      WHERE id_habitacion = $1
      `,
      [
        id_habitacion,
        estado_habitacion
      ]
    )

    // =====================================
    // 1️⃣ CREAR CUENTA
    // =====================================
    const cuentaResult = await client.query(
      `
      INSERT INTO cuenta(
        monto_estadia_cuenta,
        monto_producto_cuenta,
        monto_comanda_cuenta,
        monto_adelanto_cuenta,
        monto_recibo_cuenta,
        monto_total_cuenta,
        estado_cuenta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_cuenta
      `,
      [
        cuenta.monto_estadia_cuenta || 0,
        cuenta.monto_producto_cuenta || 0,
        cuenta.monto_comanda_cuenta || 0,
        cuenta.monto_adelanto_cuenta || 0,
        cuenta.monto_recibo_cuenta || 0,
        cuenta.monto_total_cuenta || 0,
        1
      ]
    )

    const id_cuenta = cuentaResult.rows[0].id_cuenta

    // =====================================
    // 1️⃣ INGRESAR ESTADIAS
    // =====================================
    for (const estadia of estadias) {
      await client.query(
        `INSERT INTO public.estadia(
          id_cuenta, fecha_inicio_estadia, fecha_final_estadia, noches_estadia, precio_estadia, estado_estadia
        )
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          id_cuenta,
          estadia.fecha_inicio_estadia,
          estadia.fecha_final_estadia,
          estadia.noches_estadia,
          estadia.precio_estadia,
          estadia.estado_estadia
        ]
      )
    }


    // =====================================
    // 2️⃣ CREAR RESTRICCION
    // =====================================
    const restriccionResult = await client.query(
      `
      INSERT INTO public.restriccion(        
        id_habitacion, 
        fecha_inicial_restriccion, 
        hora_inicial_restriccion, 
        fecha_final_restriccion, 
        hora_final_restriccion, 
        motivo_restriccion, 
        estado_restriccion
      )
	    VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_restriccion
      `,
      [
        id_habitacion,
        restriccion.fecha_inicial_restriccion,
        restriccion.hora_inicial_restriccion,
        restriccion.fecha_final_restriccion,
        restriccion.hora_final_restriccion,
        restriccion.motivo_restriccion,
        restriccion.estado_restriccion
      ]
    )
    const id_restriccion = restriccionResult.rows[0].id_restriccion

    // =====================================
    // 2️⃣ CREAR REGISTRO
    // =====================================
    const registroResult = await client.query(
      `
      INSERT INTO registro(
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        fecha_registro,
        precio_registro,
        total_registro,
        estado_registro
      )
      VALUES (
        $1, $2, $3, $4,
        NOW(),
        $5,$6,$7
      ) RETURNING *;
      `,
      [
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        precio_registro,
        total_registro,
        estado_registro
      ]
    )
    const id_registro = registroResult.rows[0].id_registro

    // ============================
    // 4️⃣ RELACIONAR CAJA - CUENTA
    // ============================
    await client.query(
      `
      INSERT INTO public.caja_cuenta(
      id_cuenta, id_caja)
      VALUES ($1, $2);
      `,
      [id_cuenta, id_caja]
    )

    // =====================================
    // REGISTRO_PERSONAS
    // =====================================
    for (const item of registro_personas) {
      await client.query(
        `
        INSERT INTO public.registro_persona(
        id_persona, id_registro)
        VALUES ($1, $2);
        `,
        [
          item.id_persona,
          id_registro
        ]
      )
    }

    await client.query('COMMIT')

    return {
      ...registroResult.rows[0]
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const saveRegisterModel = async (data) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const {
      id_habitacion,
      estado_habitacion,
      numero_registro,
      precio_registro,
      total_registro,
      estado_registro,
      id_caja,
      cuenta,
      restriccion,
      estadias
    } = data

    // =====================================
    // 1️⃣ MODIFICAR HABITACION
    // =====================================
    const habitacionResult = await client.query(
      `
      UPDATE habitacion
      SET        
        estado_habitacion = $2
      WHERE id_habitacion = $1
      `,
      [
        id_habitacion,
        estado_habitacion
      ]
    )

    // =====================================
    // 1️⃣ CREAR CUENTA
    // =====================================
    const cuentaResult = await client.query(
      `
      INSERT INTO cuenta(
        monto_estadia_cuenta,
        monto_producto_cuenta,
        monto_comanda_cuenta,
        monto_adelanto_cuenta,
        monto_recibo_cuenta,
        monto_total_cuenta,
        estado_cuenta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_cuenta
      `,
      [
        cuenta.monto_estadia_cuenta || 0,
        cuenta.monto_producto_cuenta || 0,
        cuenta.monto_comanda_cuenta || 0,
        cuenta.monto_adelanto_cuenta || 0,
        cuenta.monto_recibo_cuenta || 0,
        cuenta.monto_total_cuenta || 0,
        1
      ]
    )

    const id_cuenta = cuentaResult.rows[0].id_cuenta

    // =====================================
    // 1️⃣ INGRESAR ESTADIAS
    // =====================================
    for (const estadia of estadias) {
      await client.query(
        `INSERT INTO public.estadia(
          id_cuenta, fecha_inicio_estadia, fecha_final_estadia, noches_estadia, precio_estadia, estado_estadia
        )
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          id_cuenta,
          estadia.fecha_inicio_estadia,
          estadia.fecha_final_estadia,
          estadia.noches_estadia,
          estadia.precio_estadia,
          estadia.estado_estadia
        ]
      )
    }


    // =====================================
    // 2️⃣ CREAR RESTRICCION
    // =====================================
    const restriccionResult = await client.query(
      `
      INSERT INTO public.restriccion(        
        id_habitacion, 
        fecha_inicial_restriccion, 
        hora_inicial_restriccion, 
        fecha_final_restriccion, 
        hora_final_restriccion, 
        motivo_restriccion, 
        estado_restriccion
      )
	    VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_restriccion
      `,
      [
        id_habitacion,
        restriccion.fecha_inicial_restriccion,
        restriccion.hora_inicial_restriccion,
        restriccion.fecha_final_restriccion,
        restriccion.hora_final_restriccion,
        restriccion.motivo_restriccion,
        restriccion.estado_restriccion
      ]
    )
    const id_restriccion = restriccionResult.rows[0].id_restriccion

    // =====================================
    // 2️⃣ CREAR REGISTRO
    // =====================================
    const registroResult = await client.query(
      `
      INSERT INTO registro(
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        fecha_registro,
        precio_registro,
        total_registro,
        estado_registro
      )
      VALUES (
        $1, $2, $3, $4,
        NOW(),
        $5,$6,$7
      ) RETURNING *;
      `,
      [
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        precio_registro,
        total_registro,
        estado_registro
      ]
    )

    // ============================
    // 4️⃣ RELACIONAR CAJA - CUENTA
    // ============================
    await client.query(
      `
      INSERT INTO public.caja_cuenta(
      id_cuenta, id_caja)
      VALUES ($1, $2);
      `,
      [id_cuenta, id_caja]
    )

    await client.query('COMMIT')

    return {
      ...registroResult.rows[0]
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
const saveRegisterBookingModel = async (data) => {
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const {
      id_habitacion,
      estado_habitacion,

      id_restriccion,
      hora_inicial_restriccion,
      fecha_inicial_restriccion,
      fecha_final_restriccion,
      motivo_restriccion,
      estado_restriccion,

      id_reserva,
      hora_llegada_reserva,
      total_estadia_reserva,
      descuento_reserva,
      servicio_reserva,
      monto_total_reserva,
      estado_reserva,
      condicion_reserva,

      cuenta,

      numero_registro,
      precio_registro,
      total_registro,
      estado_registro,

      id_caja,

      id_persona,

      estadias
    } = data

    // =====================================
    // 1️⃣ MODIFICAR HABITACION
    // =====================================
    const habitacionResult = await client.query(
      `
      UPDATE habitacion
      SET        
        estado_habitacion = $2
      WHERE id_habitacion = $1
      `,
      [
        id_habitacion,
        estado_habitacion
      ]
    )

    // =====================================
    // 1️⃣ MODIFICAR RESTRICCION
    // =====================================
    const restrictionResult = await client.query(
      `
        UPDATE public.restriccion
        SET          
          fecha_inicial_restriccion=$2, 
          hora_inicial_restriccion = $3,          
          fecha_final_restriccion=$4,
          motivo_restriccion = $5,
          estado_restriccion = $6
        WHERE id_restriccion = $1
        RETURNING *;
        `,
      [
        id_restriccion,
        fecha_inicial_restriccion,
        hora_inicial_restriccion,
        fecha_final_restriccion,
        motivo_restriccion,
        estado_restriccion
      ]
    )

    // =====================================
    // 1️⃣ MODIFICAR RESERVA
    // =====================================
    const bookingResult = await client.query(
      `
        UPDATE public.reserva
        SET          
          hora_llegada_reserva = $2,
          total_estadia_reserva = $3,
          descuento_reserva = $4,
          servicio_reserva = $5,
          monto_total_reserva = $6,
          estado_reserva = $7,          
          condicion_reserva = $8
        WHERE id_reserva = $1
        RETURNING *;
  `,
      [
        id_reserva,
        hora_llegada_reserva,
        total_estadia_reserva,
        descuento_reserva,
        servicio_reserva,
        monto_total_reserva,
        estado_reserva,
        condicion_reserva
      ]
    )

    // =====================================
    // 1️⃣ MODIFICAR CUENTA
    // =====================================
    const cuentaResult = await client.query(
      `
      INSERT INTO cuenta(
        monto_estadia_cuenta,
        monto_producto_cuenta,
        monto_comanda_cuenta,
        monto_adelanto_cuenta,
        monto_recibo_cuenta,
        monto_total_cuenta,
        estado_cuenta
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_cuenta
      `,
      [
        cuenta.monto_estadia_cuenta || 0,
        cuenta.monto_producto_cuenta || 0,
        cuenta.monto_comanda_cuenta || 0,
        cuenta.monto_adelanto_cuenta || 0,
        cuenta.monto_recibo_cuenta || 0,
        cuenta.monto_total_cuenta || 0,
        1
      ]
    )
    const id_cuenta = cuentaResult.rows[0].id_cuenta

    // =====================================
    // 1️⃣ INGRESAR ESTADIAS
    // =====================================
    for (const estadia of estadias) {
      await client.query(
        `INSERT INTO public.estadia(
          id_cuenta, fecha_inicio_estadia, fecha_final_estadia, noches_estadia, precio_estadia, estado_estadia
        )
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          id_cuenta,
          estadia.fecha_inicio_estadia,
          estadia.fecha_final_estadia,
          estadia.noches_estadia,
          estadia.precio_estadia,
          estadia.estado_estadia
        ]
      )
    }

    // =====================================
    // 2️⃣ CREAR REGISTRO
    // =====================================
    const registroResult = await client.query(
      `
      INSERT INTO registro(
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        fecha_registro,
        precio_registro,
        total_registro,
        estado_registro
      )
      VALUES (
        $1, $2, $3, $4,
        NOW(),
        $5, $6, $7
      ) RETURNING id_registro;
      `,
      [
        id_restriccion,
        id_habitacion,
        id_cuenta,
        numero_registro,
        precio_registro,
        total_registro,
        estado_registro
      ]
    )
    const id_registro = registroResult.rows[0].id_registro

    // ============================
    // 4️⃣ RELACIONAR REGISTRO - RESERVA
    // ============================
    await client.query(
      `
      INSERT INTO registro_reserva(
        id_reserva,
        id_registro)
      VALUES ($1,$2)
      `,
      [id_reserva, id_registro]
    )

    // ============================
    // 4️⃣ RELACIONAR CAJA - CUENTA
    // ============================
    await client.query(
      `
      INSERT INTO public.caja_cuenta(
      id_cuenta, id_caja)
      VALUES ($1, $2);
      `,
      [id_cuenta, id_caja]
    )

    // =====================================
    // REGISTRO_PERSONAS
    // =====================================
    await client.query(
      `
      INSERT INTO public.registro_persona(
      id_persona, id_registro)
      VALUES ($1, $2);
      `,
      [
        id_persona,
        id_registro
      ]
    )    

    await client.query('COMMIT')

    return {
      ...registroResult.rows[0]
    }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyRegisterModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      cuenta, id_registro, total_registro, estado_registro, id_restriccion, hora_final_restriccion, estado_restriccion, existe_reserva, id_reserva, condicion_reserva, id_habitacion, estado_habitacion
    } = data

    await client.query('BEGIN')
    const updateAccount = await client.query(
      `
      UPDATE public.cuenta
      SET monto_estadia_cuenta=$2, monto_producto_cuenta=$3, monto_comanda_cuenta=$4, monto_adelanto_cuenta=$5, monto_recibo_cuenta=$6, monto_total_cuenta=$7, estado_cuenta=$8
      WHERE id_cuenta=$1;
      `,
      [
        cuenta.id_cuenta, cuenta.monto_estadia_cuenta, cuenta.monto_producto_cuenta, cuenta.monto_comanda_cuenta, cuenta.monto_adelanto_cuenta, cuenta.monto_recibo_cuenta, cuenta.monto_total_cuenta, cuenta.estado_cuenta        
      ]
    )

    await client.query(
      `
      UPDATE public.registro
      SET total_registro=$2, estado_registro=$3
      WHERE id_registro=$1; 
      `,
      [
        id_registro, total_registro, estado_registro
      ]
    )

    await client.query(
      `
      UPDATE public.restriccion
      SET hora_final_restriccion=$2, estado_restriccion=$3
      WHERE id_restriccion=$1;
      `,
      [
        id_restriccion, hora_final_restriccion, estado_restriccion
      ]
    )

    if(existe_reserva == 1){
      await client.query(
        `
        UPDATE public.reserva
        SET condicion_reserva=$2
        WHERE id_reserva=$1;
        `,
        [
          id_reserva, condicion_reserva
        ]
      )
    }

    await client.query(
        `
        UPDATE public.habitacion
        SET estado_habitacion=$2
        WHERE id_habitacion=$1;
        `,
        [
          id_habitacion, estado_habitacion
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
  getRegisterModel,
  getLastRegisterModel,
  saveRegisterModel,
  saveRegisterBookingModel,
  saveRegisterManualModel,
  modifyRegisterModel
}
