const db = require('../../config/bd')

const getYearsModel = async () => {
  try {
    const query = {
      text: `
        SELECT DISTINCT EXTRACT(YEAR FROM check_in_reserva)::int AS anos
        FROM public.reserva
        ORDER BY anos;
      `,
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}

const getMonthsYearModel = async (ano) => {
  try {
    const query = {
      text: `
        SELECT DISTINCT
        EXTRACT(MONTH FROM check_in_reserva)::int AS mes
        FROM public.reserva
        WHERE EXTRACT(YEAR FROM check_in_reserva) = $1
        ORDER BY mes;
      `,
      values: [ano]
    }
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}

const getMonthlyReportModel = async (ano, mes) => {
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
			    (r.check_in_reserva < CURRENT_DATE
          OR r.estado_reserva IN (4, 5, 6)) AND r.condicion_reserva = 2 AND 
			  r.check_in_reserva >= make_date($1, $2, 1)
			  AND r.check_in_reserva <  (make_date($1, $2, 1) + INTERVAL '1 month')


          GROUP BY
          p.id_pago,
            r.id_reserva,
            rs.id_restriccion,
            h.id_habitacion,
            c.id_categoria,
            u.id_usuario,
            pe.id_persona

          ORDER BY r.check_in_reserva desc;
      `,
      values: [ano, mes]
    }

    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}

const getReportModel = async (ano, mes, tipo) => {
  try {
    let where = `
			  r.check_in_reserva >= make_date($1, $2, 1)
			  AND r.check_in_reserva <  (make_date($1, $2, 1) + INTERVAL '1 month')`

    if (tipo == 'hoy')
      where += 'AND r.check_in_reserva::date = CURRENT_DATE AND r.estado_reserva IN (1, 2, 3)'
    if (tipo == 'check_out_hoy')
      where += 'AND r.check_out_reserva::date = CURRENT_DATE and r.condicion_reserva = 1'
    if (tipo == 'pasado')
      where += `AND (r.check_in_reserva < CURRENT_DATE
        OR r.estado_reserva IN (4, 5, 6)) AND r.condicion_reserva = 2`
    if (tipo == 'salida')
      where += 'AND r.estado_reserva = 5 AND h.estado_habitacion = 2 and r.condicion_reserva = 1'
    if (tipo == 'entrada')
      where += ` AND r.check_in_reserva >= CURRENT_DATE
            AND r.estado_reserva IN (1, 2, 3)`

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

			    ${where}

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
      values: [ano, mes]
    }

    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}

const getReportMonthModel = async (ano) => {
  try {
    const query = {
      text: `
        SELECT
          EXTRACT(MONTH FROM r.check_in_reserva) AS mes,
          COUNT(*) AS total
        FROM reserva r
        WHERE EXTRACT(YEAR FROM r.check_in_reserva) = $1
        GROUP BY mes
        ORDER BY mes;
      `,
      values: [ano]
    }

    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}

const getReportGraphicModel = async (ano, mes) => {
  try {    
    const query = {
      text: `
        SELECT
          COUNT(*) FILTER (WHERE estado_reserva = 5) AS hospedados,
          COUNT(*) FILTER (WHERE estado_reserva = 4) AS cancelados,
          COUNT(*) FILTER (WHERE estado_reserva = 6) AS no_llegaron
        FROM reserva
        WHERE EXTRACT(YEAR FROM check_in_reserva) = $1
        AND EXTRACT(MONTH FROM check_in_reserva) = $2
      `,
      values: [ano, mes]
    }

    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener el reporte:', error)
    throw error
  }
}


module.exports = {
  getYearsModel,
  getMonthsYearModel,
  getMonthlyReportModel,
  getReportModel,
  getReportMonthModel,
  getReportGraphicModel,
}