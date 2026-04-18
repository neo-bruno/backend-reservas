const { httpError } = require('../helpers/error.helper')
const kardexModel = require('../models/Kardex.models')

module.exports = {
  async getAllKardexs(req, res) {
    try {
      try {
        const kardexs = await kardexModel.getAllKardexsModel()

        if (!kardexs)
          return res.status(404).json({ message: 'no se ha encontrado los KARDEX' })
        res.status(201).json({ message: 'se ha obtenido los KARDEX', data: kardexs })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los KARDEX', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveKardex(req, res) {
    try {
      const kardex = req.body
      try {
        const Kardex = await kardexModel.saveKardexModel(kardex)
        if (!Kardex)
          return res.status(401).json({ message: 'No encuentra el Kardex' })
        res.status(200).json({ message: 'se registro el Kardex correctamente!', data: Kardex })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Kardex', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyKardex(req, res) {
    try {
      const kardex = req.body
      try {
        const Kardex = await kardexModel.modifyKardexModel(kardex)
        if (!Kardex)
          return res.status(401).json({ message: 'No encuentra el Kardex' })
        res.status(200).json({ message: 'se modifico el Kardex correctamente!', data: Kardex })
      } catch (error) {
        res.status(500).json({ message: 'Error al modificar los datos del Kardex', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },
}