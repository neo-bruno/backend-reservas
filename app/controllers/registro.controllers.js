const { httpError } = require('../helpers/error.helper')
const registroModel = require('../models/registro.models')

module.exports = {
  async saveRegister(req, res) {
    try {
      const registro = req.body
      try {
        const Registro = await registroModel.saveRegisterModel(registro)
        if (!Registro)
          return res.status(401).json({ message: 'No encuentra el Registro' })
        res.status(200).json({ message: 'se registro el Registro correctamente!', data: Registro })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Registro', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveRegisterBooking(req, res) {
    try {
      const registro = req.body
      try {
        const Registro = await registroModel.saveRegisterBookingModel(registro)
        if (!Registro)
          return res.status(401).json({ message: 'No encuentra el Registro' })
        res.status(200).json({ message: 'se registro el Registro correctamente!', data: Registro })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Registro', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveRegisterManual(req, res) {
    try {
      const registro = req.body
      try {
        const Registro = await registroModel.saveRegisterManualModel(registro)
        if (!Registro)
          return res.status(401).json({ message: 'No encuentra el Registro' })
        res.status(200).json({ message: 'se registro el Registro correctamente!', data: Registro })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Registro', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getRegister(req, res) {
    try {
      const { id_habitacion, estado_registro } = req.params
      try {
        const register = await registroModel.getRegisterModel(id_habitacion, estado_registro)

        if (!register)
          return res.status(404).json({ message: 'no se ha encontrado el REGISTRO' })
        res.status(201).json({ message: 'se ha obtenido el REGISTRO', data: register })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REGISTRO', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getLastRegister(req, res) {
    try {
      try {
        const register = await registroModel.getLastRegisterModel()
        if (!register)
          return res.status(404).json({ message: 'no se ha encontrado el REGISTRO' })
        res.status(201).json({ message: 'se ha obtenido el REGISTRO', data: register })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el REGISTRO', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyRegister(req, res) {
    try {
      const registro = req.body
      try {
        const Registro = await registroModel.modifyRegisterModel(registro)
        if (!Registro)
          return res.status(401).json({ message: 'No encuentra el Registro' })
        res.status(200).json({ message: 'se modifico el Registro correctamente!', data: Registro })
      } catch (error) {
        res.status(500).json({ message: 'Error al modificar los datos del Registro', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

}