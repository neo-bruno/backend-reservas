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

const getRoomsModels = async () => {
  try {
    const query = {
      text: `
      select * from habitacion
    `,
      values: []
    }
    const { rows } = await db.query(query)
    return rows
  } catch (error) {
    throw error
  }
}


module.exports = {
  saveRoomModel,
  modifyRoomModel,
  getRoomsModels,
}