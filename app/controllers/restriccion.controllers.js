const restrictionModel = require('../models/restriccion.models')

module.exports = {
  // 🔹 Registro de la Restriccion
  async registerRestriction(req, res) {
    try {
      const { id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion } = req.body

      const restriction = await restrictionModel.registerRestrictionModel({ id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion })

      res.status(200).json({ message: 'se ha registrado correctamente la informacion de restriccion', restriction })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  // 🔹 Obtener las restricciones
  async getRestrictions(req, res) {
    try {
      const { id_habitacion } = req.params
      const restrictions = await restrictionModel.getRestrictionsModel(id_habitacion)

      res.json({
        message: 'Se obtuvieron las restricciones por habitación',
        data: restrictions
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  },

  async modifyRestriction(req, res){
    try {
      try {
        const { id_restriccion, id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion } = req.body

        const Restriction = await restrictionModel.modifyRestrictionModel({ id_restriccion, id_habitacion, fecha_inicial_restriccion, hora_inicial_restriccion, fecha_final_restriccion, hora_final_restriccion, motivo_restriccion, estado_restriccion })

        if (!Restriction)
          return res.status(404).json({ message: 'no se ha modificado el objeto restriccion' })
        res.status(200).json({ message: 'Restriccion Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al modificar el objeto restriccion!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  }

}
