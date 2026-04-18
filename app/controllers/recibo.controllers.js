const { httpError } = require('../helpers/error.helper')
const receiptModel = require('../models/recibo.models')

module.exports = {
  async saveReceipt(req, res) {
    try {
      const recibo = req.body
      try {
        const Recibo = await receiptModel.saveReceiptModel(recibo)
        if (!Recibo)
          return res.status(401).json({ message: 'No encuentra el Recibo' })
        res.status(200).json({ message: 'se guardo el Recibo correctamente!', data: Recibo })
      } catch (error) {
        res.status(500).json({ message: 'Error al guardar los datos del Recibo', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getAllReceipt(req, res) {
    try {    
      const { id_registro } = req.params  
      try {
        const receipt = await receiptModel.getAllReceiptModel(id_registro)

        if (!receipt)
          return res.status(404).json({ message: 'no se ha encontrado el RECIBO' })
        res.status(201).json({ message: 'se ha obtenido el RECIBO', data: receipt })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el RECIBO', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getReceipt(req, res) {
    try {    
      const { numero_recibo } = req.params  
      try {
        const receipt = await receiptModel.getReceiptModel(numero_recibo)

        if (!receipt)
          return res.status(404).json({ message: 'no se ha encontrado el RECIBO' })
        res.status(201).json({ message: 'se ha obtenido el RECIBO', data: receipt })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el RECIBO', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getLastReceipt(req, res) {
    try {
      try {
        const receipt = await receiptModel.getLastReceiptModel()
        if (!receipt)
          return res.status(404).json({ message: 'no se ha encontrado el RECIBO' })
        res.status(201).json({ message: 'se ha obtenido el RECIBO', data: receipt })
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el RECIBO', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  }

}