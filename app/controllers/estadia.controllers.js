const { httpError } = require('../helpers/error.helper')
const estadiaModel = require('../models/estadia.models')

module.exports = {
  
  async modifyStay(req, res) {
    try {
      const estadia = req.body
      try {
        const Estadia = await estadiaModel.modifyStayModel(estadia)
        if (!Estadia)
          return res.status(401).json({ message: 'No encuentra la Estadia'})
        res.status(200).json({ message: 'se modifico la Estadia correctamente!', data: Estadia })
      } catch (error) {
        res.status(500).json({ message: 'Error al modificar los datos de la Estadia', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  }
}