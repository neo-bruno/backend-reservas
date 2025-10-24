const bd = require('../../config/bd')

const saveBookingModel = async (reserva) => {
  const client = await bd.connect()
  try {
    await client.query('BEGIN')

    const { id_usuario, id_habitacion, codigo_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, monto_total_reserva, estado_reserva, fecha_creacion_reserva } = reserva

    const BookingResult = await client.query(
      `
      INSERT INTO public.reserva(
      id_usuario, id_habitacion, codigo_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, monto_total_reserva, estado_reserva, fecha_creacion_reserva)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
      `,
      [ id_usuario, id_habitacion, codigo_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, monto_total_reserva, estado_reserva, fecha_creacion_reserva ]
    )
    await client.query('COMMIT')
    return { data: BookingResult.rows[0] }
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

    const { id_reserva, id_usuario, id_habitacion, codigo_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, monto_total_reserva, estado_reserva, fecha_creacion_reserva } = reserva

    const BookingResult = await client.query(
      `
      UPDATE public.reserva
      SET id_usuario=$2, id_habitacion=$3, codigo_reserva=$4, check_in_reserva=$5, check_out_reserva=$6, hora_llegada_reserva=$7, monto_total_reserva=$8, estado_reserva=$9, fecha_creacion_reserva=$10
      WHERE id_reserva = $1;
      `,
      [ id_reserva, id_usuario, id_habitacion, codigo_reserva, check_in_reserva, check_out_reserva, hora_llegada_reserva, monto_total_reserva, estado_reserva, fecha_creacion_reserva ]
    )
    await client.query('COMMIT')
    return { data: BookingResult.rows[0] }
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

module.exports = {
  saveBookingModel,
  getAllBookingModel,
  modifyBookingModel
}