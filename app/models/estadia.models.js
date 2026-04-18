const db = require('../../config/bd')

const modifyStayModel = async (data) => {
  const client = await db.connect()
  try {
    const {
      id_estadia, id_cuenta, fecha_inicio_estadia, fecha_final_estadia, noches_estadia, precio_estadia, estado_estadia
    } = data

    await client.query('BEGIN')
    const updateStay = await client.query(
      `
      UPDATE public.estadia
      SET id_cuenta=$2, fecha_inicio_estadia=$3, fecha_final_estadia=$4, noches_estadia=$5, precio_estadia=$6, estado_estadia=$7
      WHERE id_estadia=$1
      RETURNING *;
      `,
      [
        id_estadia, id_cuenta, fecha_inicio_estadia, fecha_final_estadia, noches_estadia, precio_estadia, estado_estadia
      ]
    )
    await client.query('COMMIT')
    return {
      ...updateStay.rows[0]
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  modifyStayModel,
}