const db = require('../../config/bd')

// helper para mapear los campos de habitacion
const habitacionFields = (habitacion) => {
  const { id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion } = habitacion
  return [id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion]
}

const saveRoomModel = async (habitacion) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 1️⃣ Insertar la habitación
    const { id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion } = habitacion

    const RoomResult = await client.query(
      `
      INSERT INTO public.habitacion(
        id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING id_habitacion
      `,
      [id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion]
    )

    const id_habitacion = RoomResult.rows[0].id_habitacion

    // 2️⃣ Insertar los servicios (si existen)
    if (habitacion.servicios && habitacion.servicios.length > 0) {
      for (const id_servicio of habitacion.servicios) {
        await client.query(
          `
          INSERT INTO public.habitacion_servicio(id_habitacion, id_servicio)
          VALUES ($1, $2)
          `,
          [id_habitacion, id_servicio]
        )
      }
    }

    // 3️⃣ Insertar las imágenes (si existen)
    if (habitacion.imagenes && habitacion.imagenes.length > 0) {
      for (const img of habitacion.imagenes) {
        await client.query(
          `
          INSERT INTO public.imagen(id_habitacion, id_negocio, url_imagen, descripcion_imagen)
          VALUES ($1, $2, $3, $4)
          `,
          [id_habitacion, id_negocio, img.url_imagen, img.descripcion_imagen || null]
        )
      }
    }

    await client.query('COMMIT')

    return { message: 'Habitación registrada correctamente', id_habitacion }

  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const modifyRoomModel = async (habitacion) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // extraemos id_habitacion y los demás campos
    const { id_habitacion, ...rest } = habitacion
    const fields = habitacionFields(rest)

    // el primer parámetro siempre es id_habitacion para WHERE
    const RoomResult = await client.query(
      `
      UPDATE public.habitacion
      SET id_negocio=$2, id_estado=$3, tipo_habitacion=$4, numero_habitacion=$5, nombre_habitacion=$6, precio_habitacion=$7, descripcion_habitacion=$8, capacidad_habitacion=$9
      WHERE id_habitacion=$1
      RETURNING *
      `,
      [id_habitacion, ...fields]
    )

    await client.query('COMMIT')
    return { Room: RoomResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getRoomsModel = async () => {
  try {
    const query = {
      text: `
        SELECT 
          h.id_habitacion,
          h.tipo_habitacion,
          h.nombre_habitacion,
          h.numero_habitacion,
          h.descripcion_habitacion,
          h.precio_habitacion,
          h.capacidad_habitacion,
          h.fecha_creacion_habitacion,

          -- 🔹 Estado de la habitación
          json_build_object(
            'id_estado', eh.id_estado,
            'nombre_estado', eh.nombre_estado,
            'descripcion_estado', eh.descripcion_estado,
            'tipo_estado', eh.tipo_estado
          ) AS estado_habitacion,

          -- 🔹 Objeto negocio
          json_build_object(
            'id_negocio', n.id_negocio,
            'tipo_negocio', n.tipo_negocio,
            'nombre_negocio', n.nombre_negocio,
            'ubicacion_negocio', n.ubicacion_negocio,
            'descripcion_negocio', n.descripcion_negocio,
            'telefono_negocio', n.telefono_negocio,
            'estado_negocio', json_build_object(
              'id_estado', en.id_estado,
              'nombre_estado', en.nombre_estado,
              'descripcion_estado', en.descripcion_estado,
              'tipo_estado', en.tipo_estado
            )
          ) AS negocio,

          -- 🔹 Arreglo de restricciones (fechas NO disponibles)
          (
            SELECT json_agg(
              json_build_object(
                'id_restriccion', r0.id_restriccion,
                'fecha_inicial_restriccion', r0.fecha_inicial_restriccion,
                'hora_inicial_restriccion', r0.hora_inicial_restriccion,
                'fecha_final_restriccion', r0.fecha_final_restriccion,
                'hora_final_restriccion', r0.hora_final_restriccion,
                'motivo_restriccion', r0.motivo_restriccion,
                'estado_restriccion', json_build_object(
                  'id_estado', er.id_estado,
                  'nombre_estado', er.nombre_estado
                ),
                'fecha_creacion_restriccion', r0.fecha_creacion_restriccion
              )
              ORDER BY r0.fecha_inicial_restriccion
            )
            FROM restriccion r0
            LEFT JOIN estado er ON er.id_estado = r0.estado_restriccion
            WHERE r0.id_habitacion = h.id_habitacion
          ) AS restricciones,

          -- 🔹 Arreglo de reservas (con usuario, persona y estado)
          (
            SELECT json_agg(
              json_build_object(
                'id_reserva', r.id_reserva,
                'check_in_reserva', r.check_in_reserva,
                'check_out_reserva', r.check_out_reserva,
                'hora_llegada_reserva', r.hora_llegada_reserva,
                'monto_total_reserva', r.monto_total_reserva,
                'fecha_creacion_reserva', r.fecha_creacion_reserva,

                -- 🔸 Estado de la reserva
                'estado_reserva', json_build_object(
                  'id_estado', er2.id_estado,
                  'nombre_estado', er2.nombre_estado,
                  'descripcion_estado', er2.descripcion_estado,
                  'tipo_estado', er2.tipo_estado
                ),

                -- 🟢 Usuario que realiza la reserva
                'usuario', json_build_object(
                  'id_usuario', u.id_usuario,
                  'nombre_usuario', u.nombre_usuario,
                  'telefono_usuario', u.telefono_usuario,
                  'codigo_pais_usuario', u.codigo_pais_usuario,
                  'verificado_usuario', u.verificado_usuario
                ),

                -- 🟢 Persona asociada a la reserva (si aplica)
                'persona', (
                  SELECT json_build_object(
                    'id_persona', p.id_persona,
                    'nombre_persona', p.nombre_persona,
                    'telefono_persona', p.telefono_persona,
                    'documento_persona', p.documento_persona
                  )
                  FROM persona p
                  WHERE p.id_persona = r.id_persona
                )
              )
              ORDER BY r.check_in_reserva
            )
            FROM reserva r
            JOIN usuario u ON u.id_usuario = r.id_usuario
            LEFT JOIN estado er2 ON er2.id_estado = r.id_estado
            WHERE r.id_habitacion = h.id_habitacion
          ) AS reservas

        FROM habitacion h
        JOIN negocio n ON n.id_negocio = h.id_negocio
        JOIN estado eh ON eh.id_estado = h.id_estado
        LEFT JOIN estado en ON en.id_estado = n.id_estado
        ORDER BY h.id_habitacion;
      `,
    }

    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    console.error('❌ Error en getRoomsModel:', error)
    throw error
  }
}

const getRoomByIdModel = async (id_habitacion) => {
  const query = `
    SELECT 
        h.id_habitacion,
        h.tipo_habitacion,
        h.numero_habitacion,
        h.nombre_habitacion,
        h.descripcion_habitacion,
        h.precio_habitacion,
        h.capacidad_habitacion,
        h.fecha_creacion_habitacion,

        json_build_object(
          'id_estado', e.id_estado,
          'nombre_estado', e.nombre_estado,
          'tipo_estado', e.tipo_estado,
          'descripcion_estado', e.descripcion_estado
        ) AS estado,

        json_build_object(
          'id_negocio', n.id_negocio,
          'nombre_negocio', n.nombre_negocio,
          'descripcion_negocio', n.descripcion_negocio,
          'ubicacion_negocio', n.ubicacion_negocio,
          'telefono_negocio', n.telefono_negocio,
          'tipo_negocio', n.tipo_negocio,
          'estado_negocio', n.id_estado
        ) AS negocio,

        (
          SELECT json_agg(
            json_build_object(
              'id_imagen', i.id_imagen,
              'url_imagen', i.url_imagen,
              'descripcion_imagen', i.descripcion_imagen
            ) ORDER BY i.id_imagen
          )
          FROM imagen i
          WHERE i.id_habitacion = h.id_habitacion
        ) AS imagenes,

        (
          SELECT json_agg(
            json_build_object(
              'id_servicio', s.id_servicio,
              'nombre_servicio', s.nombre_servicio,
              'icono_servicio', s.icono_servicio
            ) ORDER BY s.id_servicio
          )
          FROM habitacion_servicio hs
          JOIN servicio s ON s.id_servicio = hs.id_servicio
          WHERE hs.id_habitacion = h.id_habitacion
        ) AS servicios,

        (
          SELECT json_agg(
            json_build_object(
              'id_restriccion', r.id_restriccion,
              'fecha_inicial_restriccion', r.fecha_inicial_restriccion,
              'hora_inicial_restriccion', r.hora_inicial_restriccion,
              'fecha_final_restriccion', r.fecha_final_restriccion,
              'hora_final_restriccion', r.hora_final_restriccion,
              'motivo_restriccion', r.motivo_restriccion,
              'estado_restriccion', r.estado_restriccion
            ) ORDER BY r.fecha_inicial_restriccion
          )
          FROM restriccion r
          WHERE r.id_habitacion = h.id_habitacion
        ) AS restricciones,

        (
          SELECT json_agg(
            json_build_object(
              'id_reserva', res.id_reserva,
              'codigo_reserva', res.codigo_reserva,
              'check_in_reserva', res.check_in_reserva,
              'check_out_reserva', res.check_out_reserva,
              'hora_llegada_reserva', res.hora_llegada_reserva,
              'monto_total_reserva', res.monto_total_reserva,
              'observacion_reserva', res.observacion_reserva,
              'fecha_creacion_reserva', res.fecha_creacion_reserva,
              'estado', json_build_object(
                'id_estado', est.id_estado,
                'nombre_estado', est.nombre_estado,
                'tipo_estado', est.tipo_estado
              ),
              'usuario', json_build_object(
                'id_usuario', u.id_usuario,
                'nombre_usuario', u.nombre_usuario,
                'telefono_usuario', u.telefono_usuario,
                'codigo_pais_usuario', u.codigo_pais_usuario
              )
            ) ORDER BY res.check_in_reserva
          )
          FROM reserva res
          JOIN usuario u ON u.id_usuario = res.id_usuario
          JOIN estado est ON est.id_estado = res.id_estado
          WHERE res.id_habitacion = h.id_habitacion
        ) AS reservas,

        (
          SELECT json_agg(
            json_build_object(
              'id_resena', re.id_resena,
              'puntuacion_resena', re.puntuacion_resena,
              'comentario_resena', re.comentario_resena,
              'fecha_creacion_resena', re.fecha_creacion_resena,
              'usuario', json_build_object(
                'id_usuario', uu.id_usuario,
                'nombre_usuario', uu.nombre_usuario,
                'telefono_usuario', uu.telefono_usuario
              )
            ) ORDER BY re.fecha_creacion_resena DESC
          )
          FROM resena re
          JOIN usuario uu ON uu.id_usuario = re.id_usuario
          JOIN reserva rr ON rr.id_reserva = re.id_reserva
          WHERE rr.id_habitacion = h.id_habitacion
        ) AS resenas

      FROM habitacion h
      JOIN negocio n ON n.id_negocio = h.id_negocio
      JOIN estado e ON e.id_estado = h.id_estado
      WHERE h.id_habitacion = $1;

  `;

  const result = await db.query(query, [id_habitacion]);
  return result.rows[0];
}


module.exports = {
  saveRoomModel,
  modifyRoomModel,
  getRoomsModel,
  getRoomByIdModel,
  getRoomsModel
}