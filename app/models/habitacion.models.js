const db = require('../../config/bd')

// helper para mapear los campos de habitacion
const habitacionFields = (habitacion) => {
  const { id_negocio, tipo_habitacion, numero_habitacion, nombre_habitacion, descripcion_habitacion, capacidad_habitacion, precio_habitacion, estado_habitacion, fecha_creacion_habitacion } = habitacion
  return [id_negocio, tipo_habitacion, numero_habitacion, nombre_habitacion, descripcion_habitacion, capacidad_habitacion, precio_habitacion, estado_habitacion, fecha_creacion_habitacion]
}

const saveRoomModel = async (habitacion) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    const fields = habitacionFields(habitacion)

    const RoomResult = await client.query(
      `
      INSERT INTO public.habitacion(
        id_negocio, tipo_habitacion, numero_habitacion, nombre_habitacion, descripcion_habitacion, capacidad_habitacion, precio_habitacion, estado_habitacion, fecha_creacion_habitacion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
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
      SET id_negocio=$2, tipo_habitacion=$3, numero_habitacion=$4, nombre_habitacion=$5, descripcion_habitacion=$6, capacidad_habitacion=$7, precio_habitacion=$8, estado_habitacion=$9, fecha_creacion_habitacion=$10
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
          h.estado_habitacion,
          h.fecha_creacion_habitacion,
          
          -- 🔹 Objeto negocio
          json_build_object(
            'id_negocio', n.id_negocio,
            'tipo_negocio', n.tipo_negocio,
            'nombre_negocio', n.nombre_negocio,
            'ubicacion_negocio', n.ubicacion_negocio,
            'descripcion_negocio', n.descripcion_negocio,
            'telefono_negocio', n.telefono_negocio,
            'estado_negocio', n.estado_negocio
          ) AS negocio,

          -- 🔹 Arreglo de disponibilidades
          (
            SELECT json_agg(
              json_build_object(
                'id_disponible', d.id_disponible,
                'fecha_inicial_disponible', d.fecha_inicial_disponible,
                'fecha_final_disponible', d.fecha_final_disponible,
                'hora_inicial_disponible', d.hora_inicial_disponible,
                'hora_final_disponible', d.hora_final_disponible,
                'estado_disponible', d.estado_disponible
              )
            )
            FROM disponible d
            WHERE d.id_habitacion = h.id_habitacion
          ) AS disponibilidades,

          -- 🔹 Arreglo de reservas (con usuario)
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
              )
            )
            FROM reserva r
            JOIN usuario u ON u.id_usuario = r.id_usuario
            WHERE r.id_habitacion = h.id_habitacion
          ) AS reservas

        FROM habitacion h
        JOIN negocio n ON n.id_negocio = h.id_negocio
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