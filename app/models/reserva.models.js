const bd = require('../../config/bd')
const crypto = require('crypto')

function generarCodigoReserva() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const bytes = crypto.randomBytes(5)
  let codigo = ''

  for (let i = 0; i < 5; i++) {
    codigo += caracteres[bytes[i] % caracteres.length]
  }

  return codigo
}


const saveBookingManualModel = async (reserva) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')

    const { id_usuario, id_persona, id_habitacion, codigo_reserva, fecha_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva, restriccion, pago } = reserva

    const restrictionResult = await client.query(
      `
      INSERT INTO public.restriccion(
      id_habitacion, 
      fecha_inicial_restriccion, 
      hora_inicial_restriccion, 
      fecha_final_restriccion, 
      hora_final_restriccion, 
      motivo_restriccion, 
      estado_restriccion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_restriccion
    `,
      [
        restriccion.id_habitacion,
        restriccion.fecha_inicial_restriccion,
        restriccion.hora_inicial_restriccion,
        restriccion.fecha_final_restriccion,
        restriccion.hora_final_restriccion,
        restriccion.motivo_restriccion,
        restriccion.estado_restriccion
      ]
    )

    const id_restriccion = restrictionResult.rows[0].id_restriccion

    const BookingResult = await client.query(
      `      
      INSERT INTO public.reserva(
      id_usuario, id_persona, id_habitacion, id_restriccion, codigo_reserva, fecha_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;
      `,
      [id_usuario, id_persona, id_habitacion, id_restriccion, generarCodigoReserva(), check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva]
    )

    const id_reserva = BookingResult.rows[0].id_reserva

    if(pago.monto_pago > 0){
      await client.query(
        `
        INSERT INTO public.pago(
        id_reserva, monto_pago, tipo_pago, metodo_pago, comision_pago, fecha_pago, estado_pago, url_pago)
        VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7) RETURNING *;
        `,
        [id_reserva, pago.monto_pago, pago.tipo_pago, pago.metodo_pago, pago.comision_pago, pago.estado_pago, pago.url_pago]
      )
    }

    await client.query('COMMIT')
    return BookingResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const saveBookingModel = async (reserva) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')

    const { id_usuario, id_persona, id_habitacion, codigo_reserva, fecha_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva, restriccion } = reserva

    const restrictionResult = await client.query(
      `
      INSERT INTO public.restriccion(
      id_habitacion, 
      fecha_inicial_restriccion, 
      hora_inicial_restriccion, 
      fecha_final_restriccion, 
      hora_final_restriccion, 
      motivo_restriccion, 
      estado_restriccion)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id_restriccion
    `,
      [
        restriccion.id_habitacion,
        restriccion.fecha_inicial_restriccion,
        restriccion.hora_inicial_restriccion,
        restriccion.fecha_final_restriccion,
        restriccion.hora_final_restriccion,
        restriccion.motivo_restriccion,
        restriccion.estado_restriccion
      ]
    )

    const id_restriccion = restrictionResult.rows[0].id_restriccion

    const BookingResult = await client.query(
      `      
      INSERT INTO public.reserva(
      id_usuario, id_persona, id_habitacion, id_restriccion, codigo_reserva, fecha_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *;
      `,
      [id_usuario, id_persona, id_habitacion, id_restriccion, generarCodigoReserva(), check_in_reserva, check_out_reserva, hora_llegada_reserva, total_estadia_reserva, descuento_reserva, servicio_reserva, monto_total_reserva, estado_reserva, observacion_reserva, condicion_reserva, precio_reserva]
    )
    await client.query('COMMIT')
    return BookingResult.rows[0]
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyBookingModel = async (reserva) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')    

    const { id_restriccion, estado_restriccion, id_reserva, id_pago, observacion_reserva, condicion_reserva, estado_reserva, estado_pago, existe_pago } = reserva

    await client.query(
      `
        UPDATE public.restriccion
        SET          
          estado_restriccion = $2
        WHERE id_restriccion = $1
        RETURNING *;
        `,
      [ id_restriccion, estado_restriccion ]
    )
    
    const bookingResult = await client.query(
      `
        UPDATE public.reserva
        SET 
          estado_reserva = $2,   
          observacion_reserva = $3,                 
          condicion_reserva = $4          
        WHERE id_reserva = $1
        RETURNING *;
      `,
      [ id_reserva, estado_reserva, observacion_reserva, condicion_reserva ]
    )

    if (existe_pago) {
      await client.query(
      `
        UPDATE public.pago
        SET estado_pago=$2
        WHERE id_pago=$1
      `,
      [ id_pago, estado_pago ]
      ) 
    }

    await client.query('COMMIT')
    return {
      reserva: bookingResult.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getAllBookingModel = async () => {
  try {
    const query = {
      text: `
      select * from reserva
      `
    }
    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const getReservationsTypeModel = async (id_usuario, tipo) => {
  tipo = Number(tipo)
  switch (tipo) {
    case 1:
      return await getReservationsTypeOne(id_usuario)

    case 2:
      return await getReservationsTypeDos(id_usuario)

    case 3:
      return await getReservationsTypeTres(id_usuario)

    default:
      throw new Error(`Tipo de reserva no válido: ${tipo}`)
  }
}

const getReservationsTypeOne = async (id_usuario) => {
  try {
    const query = {
      text: `
      SELECT
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.check_in_reserva,
        r.check_out_reserva,
        r.hora_llegada_reserva,
        r.total_estadia_reserva::int,
        r.descuento_reserva::int,
        r.servicio_reserva::int,
        r.monto_total_reserva::int,
        r.estado_reserva,
        r.observacion_reserva,
        r.condicion_reserva,
        r.precio_reserva,

        /* ================= PAGOS ================= */
        jsonb_build_object(
          'id_pago', p.id_pago,
          'id_reserva', p.id_reserva,
          'monto_pago', p.monto_pago,
          'tipo_pago', p.tipo_pago,
          'metodo_pago', p.metodo_pago,
          'comision_pago', p.comision_pago,
          'fecha_pago', p.fecha_pago,
          'estado_pago', p.estado_pago,
          'url_pago', p.url_pago
        ) AS pago,

            /* ================= RESTRICCION ================= */
            jsonb_build_object(
              'id_restriccion', rs.id_restriccion,
              'fecha_inicial_restriccion', rs.fecha_inicial_restriccion,
              'hora_inicial_restriccion', rs.hora_inicial_restriccion,
              'fecha_final_restriccion', rs.fecha_final_restriccion,
              'hora_final_restriccion', rs.hora_final_restriccion,
              'motivo_restriccion', rs.motivo_restriccion,
              'estado_restriccion', rs.estado_restriccion
            ) AS restriccion,

            /* ================= HABITACION ================= */
            jsonb_build_object(
              'id_habitacion', h.id_habitacion,
              'id_categoria', h.id_categoria,
              'id_nivel', h.id_nivel,
              'numero_habitacion', h.numero_habitacion,
              'nombre_habitacion', h.nombre_habitacion,
              'adultos_habitacion', h.adultos_habitacion,
              'ninos_habitacion', h.ninos_habitacion,
              'descripcion_habitacion', h.descripcion_habitacion,
              'detalle_habitacion', h.detalle_habitacion,
              'estado_habitacion', h.estado_habitacion,
          'imagenes',
            COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
              'id_imagen', i.id_imagen,
              'id_habitacion', i.id_habitacion,
              'url_imagen', i.url_imagen,					
              'nombre_imagen', i.nombre_imagen
              )
            ) FILTER (WHERE i.id_imagen IS NOT NULL),
            '[]'
            ),
          -- 🛏️ CAMAS
              'habitacion_camas', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id_habitacion_cama', hc.id_habitacion_cama,
                      'cantidad_hab_cama', hc.cantidad_hab_cama,
                      'costo_hab_cama', hc.costo_hab_cama,
                      'total_hab_cama', hc.total_hab_cama,
                      'cama', json_build_object(
                        'id_cama', ca.id_cama,
                        'tipo_cama', ca.tipo_cama,
                        'descripcion_cama', ca.descripcion_cama,
                        'cant_persona_cama', ca.cant_persona_cama,
                        'tipo_persona_cama', ca.tipo_persona_cama,
                        'icono_persona_cama', ca.icono_persona_cama
                      )
                    )
                  ),
                  '[]'::json
                )
                FROM habitacion_cama hc
                JOIN cama ca ON ca.id_cama = hc.id_cama
                WHERE hc.id_habitacion = h.id_habitacion
              )
            ) AS habitacion,

            /* ================= CATEGORIA ================= */
            jsonb_build_object(
              'id_categoria', c.id_categoria,
              'nombre_categoria', c.nombre_categoria,
              'descripcion_categoria', c.descripcion_categoria,
              'precio_ahora_categoria', c.precio_ahora_categoria,
              'precio_antes_categoria', c.precio_antes_categoria,
              'descuento_categoria', c.descuento_categoria,
              'cant_noches_categoria', c.cant_noches_categoria

            ) AS categoria,

            /* ================= USUARIO ================= */
            jsonb_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,
              'codigo_pais_usuario', u.codigo_pais_usuario,
              'telefono_usuario', u.telefono_usuario,
              'email_usuario', u.email_usuario,
              'verificado_usuario', u.verificado_usuario
            ) AS usuario,

            /* ================= PERSONA ================= */
            jsonb_build_object(
              'id_persona', pe.id_persona,
              'nombre_persona', pe.nombre_persona,
              'documento_persona', pe.documento_persona,
              'expedicion_persona', pe.expedicion_persona,
              'fecha_nacimiento_persona', pe.fecha_nacimiento_persona,
              'razon_social_persona', pe.razon_social_persona,
              'telefono_persona', pe.telefono_persona,
              'tipo_persona', pe.tipo_persona
            ) AS persona

          FROM reserva r
          LEFT JOIN pago p ON p.id_reserva = r.id_reserva
          LEFT JOIN restriccion rs ON rs.id_restriccion = r.id_restriccion
          INNER JOIN habitacion h ON h.id_habitacion = r.id_habitacion
          INNER JOIN categoria c ON c.id_categoria = h.id_categoria
          LEFT JOIN imagen i ON i.id_habitacion = h.id_habitacion
          INNER JOIN usuario u ON u.id_usuario = r.id_usuario
          INNER JOIN persona pe ON pe.id_persona = r.id_persona

          WHERE
            r.check_in_reserva >= CURRENT_DATE
            AND r.estado_reserva IN (1, 2, 3)

          GROUP BY
          p.id_pago,
            r.id_reserva,
            rs.id_restriccion,
            h.id_habitacion,
            c.id_categoria,
            u.id_usuario,
            pe.id_persona

          ORDER BY r.check_in_reserva ASC;
      `,
    }

    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const getReservationsTypeDos = async (id_usuario) => {
  try {
    const query = {
      text: `
      SELECT
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.check_in_reserva,
        r.check_out_reserva,
        r.hora_llegada_reserva,
        r.total_estadia_reserva::int,
        r.descuento_reserva::int,
        r.servicio_reserva::int,
        r.monto_total_reserva::int,
        r.estado_reserva,
        r.observacion_reserva,
        r.condicion_reserva,
        r.precio_reserva,

        /* ================= PAGOS ================= */
        jsonb_build_object(
          'id_pago', p.id_pago,
          'id_reserva', p.id_reserva,
          'monto_pago', p.monto_pago,
          'tipo_pago', p.tipo_pago,
          'metodo_pago', p.metodo_pago,
          'comision_pago', p.comision_pago,
          'fecha_pago', p.fecha_pago,
          'estado_pago', p.estado_pago,
          'url_pago', p.url_pago
        ) AS pago,

            /* ================= RESTRICCION ================= */
            jsonb_build_object(
              'id_restriccion', rs.id_restriccion,
              'id_habitacion', rs.id_habitacion,
              'fecha_inicial_restriccion', rs.fecha_inicial_restriccion,
              'hora_inicial_restriccion', rs.hora_inicial_restriccion,
              'fecha_final_restriccion', rs.fecha_final_restriccion,
              'hora_final_restriccion', rs.hora_final_restriccion,
              'motivo_restriccion', rs.motivo_restriccion,
              'estado_restriccion', rs.estado_restriccion
            ) AS restriccion,

            /* ================= HABITACION ================= */
            jsonb_build_object(
              'id_habitacion', h.id_habitacion,
              'id_categoria', h.id_categoria,
              'id_nivel', h.id_nivel,
              'numero_habitacion', h.numero_habitacion,
              'nombre_habitacion', h.nombre_habitacion,
              'adultos_habitacion', h.adultos_habitacion,
              'ninos_habitacion', h.ninos_habitacion,
              'descripcion_habitacion', h.descripcion_habitacion,
              'detalle_habitacion', h.detalle_habitacion,
              'estado_habitacion', h.estado_habitacion,
          'imagenes',
            COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
              'id_imagen', i.id_imagen,
              'id_habitacion', i.id_habitacion,
              'url_imagen', i.url_imagen,					
              'nombre_imagen', i.nombre_imagen
              )
            ) FILTER (WHERE i.id_imagen IS NOT NULL),
            '[]'
            ),
          -- 🛏️ CAMAS
              'habitacion_camas', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id_habitacion_cama', hc.id_habitacion_cama,
                      'cantidad_hab_cama', hc.cantidad_hab_cama,
                      'costo_hab_cama', hc.costo_hab_cama,
                      'total_hab_cama', hc.total_hab_cama,
                      'cama', json_build_object(
                        'id_cama', ca.id_cama,
                        'tipo_cama', ca.tipo_cama,
                        'descripcion_cama', ca.descripcion_cama,
                        'cant_persona_cama', ca.cant_persona_cama,
                        'tipo_persona_cama', ca.tipo_persona_cama,
                        'icono_persona_cama', ca.icono_persona_cama
                      )
                    )
                  ),
                  '[]'::json
                )
                FROM habitacion_cama hc
                JOIN cama ca ON ca.id_cama = hc.id_cama
                WHERE hc.id_habitacion = h.id_habitacion
              )
            ) AS habitacion,

            /* ================= CATEGORIA ================= */
            jsonb_build_object(
              'id_categoria', c.id_categoria,
              'nombre_categoria', c.nombre_categoria,
              'descripcion_categoria', c.descripcion_categoria,
              'precio_ahora_categoria', c.precio_ahora_categoria,
              'precio_antes_categoria', c.precio_antes_categoria,
              'descuento_categoria', c.descuento_categoria,
              'cant_noches_categoria', c.cant_noches_categoria

            ) AS categoria,

            /* ================= USUARIO ================= */
            jsonb_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,
              'codigo_pais_usuario', u.codigo_pais_usuario,
              'telefono_usuario', u.telefono_usuario,
              'email_usuario', u.email_usuario,
              'verificado_usuario', u.verificado_usuario
            ) AS usuario,

            /* ================= PERSONA ================= */
            jsonb_build_object(
              'id_persona', pe.id_persona,
              'nombre_persona', pe.nombre_persona,
              'documento_persona', pe.documento_persona,
              'expedicion_persona', pe.expedicion_persona,
              'fecha_nacimiento_persona', pe.fecha_nacimiento_persona,
              'razon_social_persona', pe.razon_social_persona,
              'telefono_persona', pe.telefono_persona,
              'tipo_persona', pe.tipo_persona
            ) AS persona

          FROM reserva r
          LEFT JOIN pago p ON p.id_reserva = r.id_reserva
          LEFT JOIN restriccion rs ON rs.id_restriccion = r.id_restriccion
          INNER JOIN habitacion h ON h.id_habitacion = r.id_habitacion
          INNER JOIN categoria c ON c.id_categoria = h.id_categoria
          LEFT JOIN imagen i ON i.id_habitacion = h.id_habitacion
          INNER JOIN usuario u ON u.id_usuario = r.id_usuario
          INNER JOIN persona pe ON pe.id_persona = r.id_persona

          WHERE
            r.check_in_reserva < CURRENT_DATE
            AND r.estado_reserva IN (1, 2, 3)

          GROUP BY
          p.id_pago,
            r.id_reserva,
            rs.id_restriccion,
            h.id_habitacion,
            c.id_categoria,
            u.id_usuario,
            pe.id_persona

          ORDER BY r.check_in_reserva DESC;
      `,
    }

    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const getReservationsTypeTres = async (id_usuario) => {
  try {
    const query = {
      text: `
      SELECT
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.check_in_reserva,
        r.check_out_reserva,
        r.hora_llegada_reserva,
        r.total_estadia_reserva::int,
        r.descuento_reserva::int,
        r.servicio_reserva::int,
        r.monto_total_reserva::int,
        r.estado_reserva,
        r.observacion_reserva,
        r.condicion_reserva,
        r.precio_reserva,

        /* ================= PAGOS ================= */
        jsonb_build_object(
          'id_pago', p.id_pago,
          'id_reserva', p.id_reserva,
          'monto_pago', p.monto_pago::int,
          'tipo_pago', p.tipo_pago,
          'metodo_pago', p.metodo_pago,
          'comision_pago', p.comision_pago,
          'fecha_pago', p.fecha_pago,
          'estado_pago', p.estado_pago,
          'url_pago', p.url_pago
        ) AS pago,

            /* ================= RESTRICCION ================= */
            jsonb_build_object(
              'id_restriccion', rs.id_restriccion,
              'id_habitacion', rs.id_habitacion,
              'fecha_inicial_restriccion', rs.fecha_inicial_restriccion,
              'hora_inicial_restriccion', rs.hora_inicial_restriccion,
              'fecha_final_restriccion', rs.fecha_final_restriccion,
              'hora_final_restriccion', rs.hora_final_restriccion,
              'motivo_restriccion', rs.motivo_restriccion,
              'estado_restriccion', rs.estado_restriccion
            ) AS restriccion,

            /* ================= HABITACION ================= */
            jsonb_build_object(
              'id_habitacion', h.id_habitacion,
              'id_categoria', h.id_categoria,
              'id_nivel', h.id_nivel,
              'numero_habitacion', h.numero_habitacion,
              'nombre_habitacion', h.nombre_habitacion,
              'adultos_habitacion', h.adultos_habitacion,
              'ninos_habitacion', h.ninos_habitacion,
              'descripcion_habitacion', h.descripcion_habitacion,
              'detalle_habitacion', h.detalle_habitacion,
              'estado_habitacion', h.estado_habitacion,
          'imagenes',
            COALESCE(
            json_agg(
              DISTINCT jsonb_build_object(
              'id_imagen', i.id_imagen,
              'id_habitacion', i.id_habitacion,
              'url_imagen', i.url_imagen,					
              'nombre_imagen', i.nombre_imagen
              )
            ) FILTER (WHERE i.id_imagen IS NOT NULL),
            '[]'
            ),
          -- 🛏️ CAMAS
              'habitacion_camas', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id_habitacion_cama', hc.id_habitacion_cama,
                      'cantidad_hab_cama', hc.cantidad_hab_cama,
                      'costo_hab_cama', hc.costo_hab_cama,
                      'total_hab_cama', hc.total_hab_cama,
                      'cama', json_build_object(
                        'id_cama', ca.id_cama,
                        'tipo_cama', ca.tipo_cama,
                        'descripcion_cama', ca.descripcion_cama,
                        'cant_persona_cama', ca.cant_persona_cama,
                        'tipo_persona_cama', ca.tipo_persona_cama,
                        'icono_persona_cama', ca.icono_persona_cama
                      )
                    )
                  ),
                  '[]'::json
                )
                FROM habitacion_cama hc
                JOIN cama ca ON ca.id_cama = hc.id_cama
                WHERE hc.id_habitacion = h.id_habitacion
              )
            ) AS habitacion,

            /* ================= CATEGORIA ================= */
            jsonb_build_object(
              'id_categoria', c.id_categoria,
              'nombre_categoria', c.nombre_categoria,
              'descripcion_categoria', c.descripcion_categoria,
              'precio_ahora_categoria', c.precio_ahora_categoria,
              'precio_antes_categoria', c.precio_antes_categoria,
              'descuento_categoria', c.descuento_categoria,
              'cant_noches_categoria', c.cant_noches_categoria

            ) AS categoria,

            /* ================= USUARIO ================= */
            jsonb_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,
              'codigo_pais_usuario', u.codigo_pais_usuario,
              'telefono_usuario', u.telefono_usuario,
              'email_usuario', u.email_usuario,
              'verificado_usuario', u.verificado_usuario
            ) AS usuario,

            /* ================= PERSONA ================= */
            jsonb_build_object(
              'id_persona', pe.id_persona,
              'nombre_persona', pe.nombre_persona,
              'documento_persona', pe.documento_persona,
              'expedicion_persona', pe.expedicion_persona,
              'fecha_nacimiento_persona', pe.fecha_nacimiento_persona,
              'razon_social_persona', pe.razon_social_persona,
              'telefono_persona', pe.telefono_persona,
              'tipo_persona', pe.tipo_persona
            ) AS persona

          FROM reserva r
          LEFT JOIN pago p ON p.id_reserva = r.id_reserva
          LEFT JOIN restriccion rs ON rs.id_restriccion = r.id_restriccion
          INNER JOIN habitacion h ON h.id_habitacion = r.id_habitacion
          INNER JOIN categoria c ON c.id_categoria = h.id_categoria
          LEFT JOIN imagen i ON i.id_habitacion = h.id_habitacion
          INNER JOIN usuario u ON u.id_usuario = r.id_usuario
          INNER JOIN persona pe ON pe.id_persona = r.id_persona

          WHERE            
            r.estado_reserva = 5 AND h.estado_habitacion = 2 and r.condicion_reserva = 1

          GROUP BY
          p.id_pago,
            r.id_reserva,
            rs.id_restriccion,
            h.id_habitacion,
            c.id_categoria,
            u.id_usuario,
            pe.id_persona

          ORDER BY r.check_in_reserva DESC;
      `,
    }

    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const reservasActivasInactivasModel = async (id_usuario, tipo) => {
  switch (tipo) {
    case 'reservas_activas':
      return await getReservationsIdUserModel(id_usuario)

    case 'reservas_inactivas':
      return await getReservationsPastByUserModel(id_usuario)

    default:
      throw new Error('Tipo de reserva no válido')
  }
}

const getReservationsIdUserModel = async (id_usuario) => {
  try {
    const query = {
      text: `
      SELECT
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.check_in_reserva,
        r.check_out_reserva,
        r.hora_llegada_reserva,
        r.total_estadia_reserva::int,
        r.descuento_reserva::int,
        r.servicio_reserva::int,
        r.monto_total_reserva::int,
        r.estado_reserva,
        r.observacion_reserva,
        r.condicion_reserva,
        r.precio_reserva,
		
        /* ================= PAGO ================= */
        -- 💳 PAGOS
        jsonb_build_object(
          'id_pago', pa.id_pago,
          'monto_pago', pa.monto_pago,
          'tipo_pago', pa.tipo_pago,
          'metodo_pago', pa.metodo_pago,
          'comision_pago', pa.comision_pago,
          'fecha_pago', pa.fecha_pago,
          'estado_pago', pa.estado_pago,
          'url_pago', pa.url_pago
        ) AS pago,

            -- 👤 USUARIO
            json_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,
              'email_usuario', u.email_usuario,
              'telefono_usuario', u.telefono_usuario,
              'codigo_pais_usuario', u.codigo_pais_usuario
            ) AS usuario,

            -- 👥 PERSONA
            json_build_object(
              'id_persona', p.id_persona,
              'nombre_persona', p.nombre_persona,
              'fecha_nacimiento_persona', p.fecha_nacimiento_persona,
              'documento_persona', p.documento_persona,
              'telefono_persona', p.telefono_persona
            ) AS persona,

            -- 🏨 HABITACIÓN (COMPLETA)
            json_build_object(
              'id_habitacion', h.id_habitacion,
              'numero_habitacion', h.numero_habitacion,
              'nombre_habitacion', h.nombre_habitacion,
              'adultos_habitacion', h.adultos_habitacion,
              'ninos_habitacion', h.ninos_habitacion,
              'descripcion_habitacion', h.descripcion_habitacion,
              'detalle_habitacion', h.detalle_habitacion,
              'estado_habitacion', h.estado_habitacion,

              -- 🏷️ CATEGORÍA
              'categoria', json_build_object(
                'id_categoria', c.id_categoria,
                'nombre_categoria', c.nombre_categoria,
                'descripcion_categoria', c.descripcion_categoria,
                'precio_ahora_categoria', c.precio_ahora_categoria,
                'precio_antes_categoria', c.precio_antes_categoria,
                'descuento_categoria', c.descuento_categoria,
                'cant_noches_categoria', c.cant_noches_categoria
              ),

              -- 🖼️ IMÁGENES
              'imagenes', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id_imagen', i.id_imagen,
                      'id_habitacion', i.id_habitacion,                      
                      'url_imagen', i.url_imagen,
                      'nombre_imagen', i.nombre_imagen
                    )
                    ORDER BY i.id_imagen
                  ),
                  '[]'::json
                )
                FROM imagen i
                WHERE i.id_habitacion = h.id_habitacion
              ),

              -- 🛏️ CAMAS
              'habitacion_camas', (
                SELECT COALESCE(
                  json_agg(
                    json_build_object(
                      'id_habitacion_cama', hc.id_habitacion_cama,
                      'cantidad_hab_cama', hc.cantidad_hab_cama,
                      'costo_hab_cama', hc.costo_hab_cama,
                      'total_hab_cama', hc.total_hab_cama,
                      'cama', json_build_object(
                        'id_cama', ca.id_cama,
                        'tipo_cama', ca.tipo_cama,
                        'descripcion_cama', ca.descripcion_cama,
                        'cant_persona_cama', ca.cant_persona_cama,
                        'tipo_persona_cama', ca.tipo_persona_cama,
                        'icono_persona_cama', ca.icono_persona_cama
                      )
                    )
                  ),
                  '[]'::json
                )
                FROM habitacion_cama hc
                JOIN cama ca ON ca.id_cama = hc.id_cama
                WHERE hc.id_habitacion = h.id_habitacion
              )
            ) AS habitacion,

            -- ⛔ RESTRICCIÓN
            CASE
              WHEN re.id_restriccion IS NOT NULL THEN
                json_build_object(
                  'id_restriccion', re.id_restriccion,
                  'id_habitacion', re.id_habitacion,
                  'fecha_inicial_restriccion', re.fecha_inicial_restriccion,
                  'hora_inicial_restriccion', re.hora_inicial_restriccion,
                  'fecha_final_restriccion', re.fecha_final_restriccion,
                  'hora_final_restriccion', re.hora_final_restriccion,
                  'motivo_restriccion', re.motivo_restriccion,
                  'estado_restriccion', re.estado_restriccion
                )
              ELSE NULL
            END AS restriccion        

          FROM reserva r
        LEFT JOIN pago pa ON pa.id_reserva = r.id_reserva
          JOIN usuario u ON u.id_usuario = r.id_usuario

          LEFT JOIN persona p ON p.id_persona = r.id_persona
          LEFT JOIN habitacion h ON h.id_habitacion = r.id_habitacion
          LEFT JOIN categoria c ON c.id_categoria = h.id_categoria
          LEFT JOIN restriccion re ON re.id_restriccion = r.id_restriccion

          WHERE r.id_usuario = $1
                  AND r.check_in_reserva >= CURRENT_DATE
                  AND r.estado_reserva IN (1, 2, 3)
          ORDER BY r.check_in_reserva ASC;

      `,
      values: [id_usuario]
    }

    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

const getReservationsPastByUserModel = async (id_usuario) => {
  try {
    const query = {
      text: `
      SELECT
        r.id_reserva,
        r.codigo_reserva,
        r.fecha_reserva,
        r.check_in_reserva,
        r.check_out_reserva,
        r.hora_llegada_reserva,
        r.total_estadia_reserva::int,
        r.descuento_reserva::int,
        r.servicio_reserva::int,
        r.monto_total_reserva::int,
        r.estado_reserva,
        r.observacion_reserva,
        r.condicion_reserva,
        r.precio_reserva,

        /* ================= PAGO ================= */
        -- 💳 PAGOS
        jsonb_build_object(
          'id_pago', pa.id_pago,
          'monto_pago', pa.monto_pago,
          'tipo_pago', pa.tipo_pago,
          'metodo_pago', pa.metodo_pago,
          'comision_pago', pa.comision_pago,
          'fecha_pago', pa.fecha_pago,
          'estado_pago', pa.estado_pago,
          'url_pago', pa.url_pago
        ) AS pago,

        -- 👤 USUARIO
        json_build_object(
          'id_usuario', u.id_usuario,
          'nombre_usuario', u.nombre_usuario,
          'email_usuario', u.email_usuario,
          'telefono_usuario', u.telefono_usuario,
          'codigo_pais_usuario', u.codigo_pais_usuario
        ) AS usuario,

        -- 👥 PERSONA
        json_build_object(
          'id_persona', p.id_persona,
          'nombre_persona', p.nombre_persona,
          'fecha_nacimiento_persona', p.fecha_nacimiento_persona,
          'documento_persona', p.documento_persona,
          'telefono_persona', p.telefono_persona
        ) AS persona,

        -- 🏨 HABITACIÓN (COMPLETA)
        json_build_object(
          'id_habitacion', h.id_habitacion,
          'numero_habitacion', h.numero_habitacion,
          'nombre_habitacion', h.nombre_habitacion,
          'adultos_habitacion', h.adultos_habitacion,
          'ninos_habitacion', h.ninos_habitacion,
          'descripcion_habitacion', h.descripcion_habitacion,
          'detalle_habitacion', h.detalle_habitacion,
          'estado_habitacion', h.estado_habitacion,

          -- 🏷️ CATEGORÍA
          'categoria', json_build_object(
            'id_categoria', c.id_categoria,
            'nombre_categoria', c.nombre_categoria,
            'descripcion_categoria', c.descripcion_categoria,
            'precio_ahora_categoria', c.precio_ahora_categoria,
            'precio_antes_categoria', c.precio_antes_categoria,
            'descuento_categoria', c.descuento_categoria,
            'cant_noches_categoria', c.cant_noches_categoria
          ),

          -- 🖼️ IMÁGENES
          'imagenes', (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id_imagen', i.id_imagen,
                  'id_habitacion', i.id_habitacion,                  
                  'url_imagen', i.url_imagen,
                  'nombre_imagen', i.nombre_imagen
                )
                ORDER BY i.id_imagen
              ),
              '[]'::json
            )
            FROM imagen i
            WHERE i.id_habitacion = h.id_habitacion
          ),

          -- 🛏️ CAMAS
          'habitacion_camas', (
            SELECT COALESCE(
              json_agg(
                json_build_object(
                  'id_habitacion_cama', hc.id_habitacion_cama,
                  'cantidad_hab_cama', hc.cantidad_hab_cama,
                  'costo_hab_cama', hc.costo_hab_cama,
                  'total_hab_cama', hc.total_hab_cama,
                  'cama', json_build_object(
                    'id_cama', ca.id_cama,
                    'tipo_cama', ca.tipo_cama,
                    'descripcion_cama', ca.descripcion_cama,
                    'cant_persona_cama', ca.cant_persona_cama,
                    'tipo_persona_cama', ca.tipo_persona_cama,
                    'icono_persona_cama', ca.icono_persona_cama
                  )
                )
              ),
              '[]'::json
            )
            FROM habitacion_cama hc
            JOIN cama ca ON ca.id_cama = hc.id_cama
            WHERE hc.id_habitacion = h.id_habitacion
          )
        ) AS habitacion,

        -- ⛔ RESTRICCIÓN
        CASE
          WHEN re.id_restriccion IS NOT NULL THEN
            json_build_object(
              'id_restriccion', re.id_restriccion,
              'fecha_inicial_restriccion', re.fecha_inicial_restriccion,
              'hora_inicial_restriccion', re.hora_inicial_restriccion,
              'fecha_final_restriccion', re.fecha_final_restriccion,
              'hora_final_restriccion', re.hora_final_restriccion,
              'motivo_restriccion', re.motivo_restriccion,
              'estado_restriccion', re.estado_restriccion
            )
          ELSE NULL
        END AS restriccion,

        -- 💳 PAGOS
        (
          SELECT COALESCE(
            json_agg(
              json_build_object(
                'id_pago', pa.id_pago,
                'monto_pago', pa.monto_pago,
                'metodo_pago', pa.metodo_pago,
                'estado_pago', pa.estado_pago,
                'fecha_pago', pa.fecha_pago
              )
              ORDER BY pa.fecha_pago
            ),
            '[]'::json
          )
          FROM pago pa
          WHERE pa.id_reserva = r.id_reserva
        ) AS pagos

      FROM reserva r
      LEFT JOIN pago pa ON pa.id_reserva = r.id_reserva
      JOIN usuario u ON u.id_usuario = r.id_usuario

      LEFT JOIN persona p ON p.id_persona = r.id_persona
      LEFT JOIN habitacion h ON h.id_habitacion = r.id_habitacion
      LEFT JOIN categoria c ON c.id_categoria = h.id_categoria
      LEFT JOIN restriccion re ON re.id_restriccion = r.id_restriccion

      WHERE r.id_usuario = $1
              AND (
          r.check_in_reserva < CURRENT_DATE
          OR r.estado_reserva > 3
        )
      ORDER BY r.check_in_reserva ASC;

      `,
      values: [id_usuario]
    }

    const { rows } = await bd.query(query)
    return rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  saveBookingModel,
  saveBookingManualModel,
  getAllBookingModel,
  modifyBookingModel,
  reservasActivasInactivasModel,
  getReservationsTypeModel
}