const { httpError } = require('../helpers/error.helper')
const ServiceModel = require('../models/service.models')

const saveService = async (req, res) => {
  try {
    const service = req.body
    try {
      const Service = await ServiceModel.saveServiceModel(service)
      if(!Service)
        return res.status(401).json({ message: 'No encuentra el Servicio'})
      res.status(200).json({ message: 'se registro el Servicio correctamente!', data: Service})
    } catch (error) {
      res.status(500).json({message: 'Error al guardar los datos del Servicio', error: error.message})
    }
  } catch (error) {
    httpError(res, error)
  }
}

const getServices = async (req, res) => {
  try {
    try {
      const servicios = await ServiceModel.getServicesModel()
      if(!servicios)
        return res.status(401).json({ message: 'No se encontro los SERVICIOS'})
      res.status(201).json({message: 'se ha obtenido los servicios correctamente!', data: servicios})
    } catch (error) {
      res.status(500).json({message: 'Error, nose ha podido encontrar los servicios', error: error.message})
    }
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = {
  saveService,
  getServices
}