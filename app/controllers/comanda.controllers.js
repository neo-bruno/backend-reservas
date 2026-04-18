const { httpError } = require('../helpers/error.helper')
const comandaModel = require('../models/comanda.models')

module.exports = {
  async getLastCommand(req, res) {
    try {
      const comanda = await comandaModel.getLastCommandModel()
      res.status(201).json({
        message: 'Se ha obtenido la comanda',
        data: comanda
      })
    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener la comanda',
        error: error.message
      })
    }
  },

  async getCommands(req, res) {
    try {
      const { id_cuenta } = req.params
      const comandas = await comandaModel.getCommandsModel(id_cuenta)
      if (!comandas || comandas.length === 0) {
        return res.status(404).json({
          message: 'No se encontraron comandas'
        })
      }
      res.status(200).json({
        message: 'Se han obtenido las comandas',
        data: comandas
      })

    } catch (error) {
      res.status(500).json({
        message: 'Error al obtener las comandas',
        error: error.message
      })
    }
  },

  async saveCommand(req, res) {
    try {
      try {
        const data = req.body

        const comanda = await comandaModel.saveCommandModel(data)

        if (!comanda)
          return res.status(404).json({ message: 'no se ha encontrado el objeto COMANDA' })
        res.status(200).json({ message: 'COMANDA Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar el objeto COMANDA!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveConsumption(req, res) {
    try {
      try {
        const data = req.body

        const comanda = await comandaModel.saveConsumptionModel(data)

        if (!comanda)
          return res.status(404).json({ message: 'no se ha encontrado el objeto PRODUCTO' })
        res.status(200).json({ message: 'PRODUCTO Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar el objeto PRODUCTO!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async deleteCommand(req, res) {
    try {
      const { id_comanda } = req.params
      if (!id_comanda) {
        return res.status(400).json({
          ok: false,
          message: 'id_comanda es requerido'
        })
      }
      await comandaModel.deleteCommandModel(id_comanda)
      res.json({
        ok: true,
        message: 'Comanda eliminada correctamente'
      })

    } catch (error) {
      console.error(error)
      res.status(500).json({
        ok: false,
        message: 'Error al eliminar la comanda'
      })
    }
  }
}