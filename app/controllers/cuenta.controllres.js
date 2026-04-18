const { httpError } = require('../helpers/error.helper')
const cuentaModel = require('../models/cuenta.models')

module.exports = {
  
  async getAllAccounts(req, res) {
      try {        
        try {
          const account = await cuentaModel.getAllAccountsModel()  
          if(!account)
            return res.status(404).json({ message: 'no se ha encontrado el objeto CUENTA'})
          res.status(201).json({ message: 'se ha obtenido el CUENTA', data: account})
        } catch (error) {
          res.status(500).json({ message: 'error al obtener el CUENTA', error: error.message})
        }
      } catch (error) {
        httpError(res, error)
      }
    },

  async saveAccount(req, res) {
    try {
      try {
        const data = req.body

        const cuenta = await cuentaModel.saveAccountModel(data)

        if (!cuenta)
          return res.status(404).json({ message: 'no se ha encontrado el objeto CUENTA' })
        res.status(200).json({ message: 'CUENTA Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar el objeto CUENTA!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyAccount(req, res) {
    try {
      const cuenta = req.body
      try {
        const Cuenta = await cuentaModel.modifyAccountModel(cuenta)
        if (!Cuenta)
          return res.status(401).json({ message: 'No encuentra la Cuenta' })
        res.status(200).json({ message: 'se modifico la Cuenta correctamente!', data: Cuenta })
      } catch (error) {
        res.status(500).json({ message: 'Error al modificar los datos de la Cuenta', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  }
}