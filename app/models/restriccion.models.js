const axios = require('axios')
const db = require('../../config/bd')
const bcrypt = require('../helpers/bcrypt.helper')

const registerRestrictionModel = async ({ id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    
    // 3) si no existe persona, insertarla
    const insertRestriction = await client.query(
      `INSERT INTO public.restriccion(
       id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion
      ]
    )
    await client.query('COMMIT')
    return {
      ...insertRestriction.rows[0]
    }    
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

const getRestrictionsModel = async (id_habitacion) => {
  try {
    const query = {
      text: `
        select * from restriccion where id_habitacion = $1 and estado_restriccion = 1
      `,
      values: [id_habitacion]
    }    
    const { rows } = await db.query(query)
    return rows || [] // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las restricciones:', error)
    throw error
  }
}

const modifyRestrictionModel = async ({ id_restriccion, id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion }) => {
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    
    const RestrictionResult = await client.query(
      `
      UPDATE public.restriccion
      SET id_habitacion=$2, fecha_inicial_restriccion=$3, hora_inicial_restriccion=$4, fecha_final_restriccion=$5, hora_final_restriccion=$6, motivo_restriccion=$7, estado_restriccion=$8
      WHERE id_restriccion=$1 RETURNING *;
      `,
      [ id_restriccion, id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion ]
    )
    await client.query('COMMIT')
    return { data: RestrictionResult.rows[0] }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

module.exports = {
  registerRestrictionModel,
  getRestrictionsModel,
  modifyRestrictionModel
}
