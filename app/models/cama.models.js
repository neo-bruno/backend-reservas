const db = require('../../config/bd')

const getBedsModel = async () => {
  try {
    const query = {
      text: `
         SELECT * FROM cama ORDER BY id_cama
      `,
    }    
    const { rows } = await db.query(query)
    return rows || {} // 👈 Devuelve un objeto vacío si no hay resultados
  } catch (error) {
    console.error('Error al obtener todas las camas:', error)
    throw error
  }
}

module.exports = {
  getBedsModel,
}