const { httpError } = require('../helpers/error.helper')
const flujoModel = require('../models/flujo.models')

module.exports = {
  async getFlujos(req, res) {
    try {
      const id_caja = req.params.id_caja
      const flujos = await flujoModel.getFlujosModel(id_caja)
      res.status(201).json({
        message: 'Se ha obtenido los flujos',
        data: flujos
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener los flujos',
        error: error.message
      })
    }
  },

  async getFlujo(req, res) {
    try {
      const id_flujo = req.params.id_flujo
      const flujo = await flujoModel.getFlujosModel(id_flujo)
      res.status(201).json({
        message: 'Se ha obtenido los flujo',
        data: flujo
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener los flujo',
        error: error.message
      })
    }
  },

  async saveFlujo(req, res) {
    try {
      try {
        const data = req.body

        const flujo = await flujoModel.saveFlujoModel(data)

        if (!flujo)
          return res.status(404).json({ message: 'no se ha encontrado el objeto FLUJO' })
        res.status(200).json({ message: 'FLUJO Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar el objeto FLUJO!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyFlujo(req, res) {
    try {
      try {
        const data = req.body

        const flujo = await flujoModel.modifyFlujoModel(data)

        if (!flujo)
          return res.status(404).json({ message: 'no se ha encontrado el objeto FLUJO' })
        res.status(200).json({ message: 'FLUJO Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al modificar el objeto FLUJO!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async deleteFlujo(req, res) {
    try {
      const { id_flujo } = req.params
      if (!id_flujo) {
        return res.status(400).json({
          ok: false,
          message: 'id_flujo es requerido'
        })
      }
      await flujoModel.deleteFlujoModel(id_flujo)
      res.json({
        ok: true,
        message: 'Flujo eliminado correctamente'
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        ok: false,
        message: 'Error al eliminar la flujo'
      })
    }
  }
}