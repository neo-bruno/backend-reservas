const { httpError } = require('../helpers/error.helper')
const ServiceModel = require('../models/service.models')

const saveService = async (req, res) => {
  try {
    const service = req.body
    try {
      const Service = await ServiceModel.saveServiceModel(service)
      if (!Service)
        return res.status(401).json({ message: 'No encuentra el Servicio' })
      res.status(200).json({ message: 'se registro el Servicio correctamente!', data: Service })
    } catch (error) {
      res.status(500).json({ message: 'Error al guardar los datos del Servicio', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const modifyService = async (req, res) => {
  try {
    try {
      const { id_servicio, nombre_servicio, icono_servicio } = req.body

      const Servicio = await ServiceModel.modifyServiceModel({ id_servicio, nombre_servicio, icono_servicio })

      if (!Servicio)
        return res.status(404).json({ message: 'no se ha encontrado el objeto servicio' })
      res.status(200).json({ message: 'Nivel Modificado correctamente!' })
    } catch (error) {
      res.status(500).json({ message: 'error al modificar el objeto servicio!!!', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const getServices = async (req, res) => {
  try {
    try {
      const servicios = await ServiceModel.getServicesModel()
      if (!servicios)
        return res.status(401).json({ message: 'No se encontro los SERVICIOS' })
      res.status(201).json({ message: 'se ha obtenido los servicios correctamente!', data: servicios })
    } catch (error) {
      res.status(500).json({ message: 'Error, nose ha podido encontrar los servicios', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

const getService = async (req, res) => {
  try {
    const id_servicio = req.params.id_servicio
    try {      
      const servicio = await ServiceModel.getServiceModel(id_servicio)
      if (!servicio)
        return res.status(401).json({ message: 'No se encontro los SERVICIOS' })
      res.status(201).json({ message: 'se ha obtenido los servicio correctamente!', data: servicio })
    } catch (error) {
      res.status(500).json({ message: 'Error, nose ha podido encontrar los servicio', error: error.message })
    }
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = {
  saveService,
  getServices,
  getService,
  modifyService,
}