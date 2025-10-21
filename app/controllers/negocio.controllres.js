const { httpError } = require('../helpers/error.helper')
const BusinessModel = require('../models/negocio.models')

const saveBusiness = async (req, res) => {
  try {
    const negocio = req.body
    try {
      const Negocio = await BusinessModel.saveBusinessModel(negocio)
      if (!Negocio)
        return res.status(404).json({ message: 'No encuentra el Negocio' })
      res.status(200).json({ message: 'Negocio registrado correctamente.!', data: Negocio })
    } catch (error) {
      res.status(500).json({ message: 'Error al guardar los datos del Negocio', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const getBusiness = async (req, res) => {
  const tipo_negocio = req.params.tipo_negocio
  try {
    const Negocio = await BusinessModel.getBusinessModel(tipo_negocio)
    try {
      if (!Negocio)
        return res.status(404).json({ message: 'No encontro el Negocio.' })
      res.status(201).json({ message: 'se ha obtenido los negocios correspondientes', data: Negocio })
    } catch (error) {
      res.status(500).json({ message: 'Error, no se ha obtenido los negocios respectivos', error: error.message})
    }
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = {
  saveBusiness,
  getBusiness
}