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

    const fields = habitacionFields(habitacion)

    const RoomResult = await client.query(
      `
      INSERT INTO public.habitacion(
        id_negocio, id_estado, tipo_habitacion, numero_habitacion, nombre_habitacion, precio_habitacion, descripcion_habitacion, capacidad_habitacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
      `,
      fields
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
      SET id_negocio=$2, id_estado=$3, tipo_habitacion=$4, numero_habitacion=$5, nombre_habitacion=$6, precio_habitacion=$7, descripcion_habitacion=$8, capacidad_habitacion=$9, fecha_creacion_habitacion=$10
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
            'nombre_estado', eh.nombre_estado
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
              'nombre_estado', en.nombre_estado
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
                  'nombre_estado', er2.nombre_estado
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
      h.nombre_habitacion,
      h.numero_habitacion,
      h.descripcion_habitacion,
      h.precio_habitacion,
      h.capacidad_habitacion,
      h.estado_habitacion,
      h.fecha_creacion_habitacion,
      
      json_build_object(
        'id_negocio', n.id_negocio,
        'nombre_negocio', n.nombre_negocio,
        'descripcion_negocio', n.descripcion_negocio,
        'ubicacion_negocio', n.ubicacion_negocio
      ) AS negocio,
      
      (
        SELECT json_agg(
          json_build_object(
            'id_disponible', d.id_disponible,
            'fecha_inicial_disponible', d.fecha_inicial_disponible,
            'fecha_final_disponible', d.fecha_final_disponible,
            'hora_inicial_disponible', d.hora_inicial_disponible,
            'hora_final_disponible', d.hora_final_disponible,
            'estado_disponible', d.estado_disponible
          ) ORDER BY d.fecha_inicial_disponible
        )
        FROM disponible d
        WHERE d.id_habitacion = h.id_habitacion
      ) AS disponibilidades,
      
      (
        SELECT json_agg(
          json_build_object(
            'id_reserva', r.id_reserva,
            'check_in_reserva', r.check_in_reserva,
            'check_out_reserva', r.check_out_reserva,
            'hora_llegada_reserva', r.hora_llegada_reserva,
            'monto_total_reserva', r.monto_total_reserva,
            'estado_reserva', r.estado_reserva,
            'usuario', json_build_object(
              'id_usuario', u.id_usuario,
              'nombre_usuario', u.nombre_usuario,
              'telefono_usuario', u.telefono_usuario
            )
          ) ORDER BY r.check_in_reserva
        )
        FROM reserva r
        JOIN usuario u ON u.id_usuario = r.id_usuario
        WHERE r.id_habitacion = h.id_habitacion
      ) AS reservas

    FROM habitacion h
    JOIN negocio n ON n.id_negocio = h.id_negocio
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