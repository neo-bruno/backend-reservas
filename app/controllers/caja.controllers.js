const { httpError } = require('../helpers/error.helper')
const cajaModel = require('../models/caja.models')

module.exports = {
  async saveCaja(req, res) {
    try {
      const caja = req.body
      try {
        const Caja = await cajaModel.saveCajaModel(caja)
        if (!Caja)
          return res.status(401).json({ message: 'No encuentra la Caja' })
        res.status(200).json({ message: 'se guardo la Caja correctamente!', data: Caja })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos de la Caja', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getCajaActiva(req, res) {
    try {
      try {
        const caja = await cajaModel.getCajaActivaModel()
        if (!caja)
          return res.status(404).json({ message: 'no se ha encontrado las CAJAS' })
        res.status(201).json({ message: 'se ha obtenido las CAJAS', data: caja })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener las CAJAS', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getCaja(req, res) {
    try {
      const { id_caja } = req.params
      try {
        const caja = await cajaModel.getCajaModel(id_caja)
        if (!caja || null)
          return res.status(404).json({ message: 'no se ha encontrado la CAJA' })
        res.status(201).json({ message: 'se ha obtenido la CAJA', data: caja })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener la CAJA', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyCaja(req, res) {
    try {
      const caja = req.body
      try {
        const Caja = await cajaModel.modifyCajaModel(caja)

        if (!Caja)
          return res.status(404).json({ message: 'no se ha encontrado el objeto caja' })
        res.status(200).json({ message: 'caja Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al modificar el objeto caja!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },
}