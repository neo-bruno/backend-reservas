const { httpError } = require('../helpers/error.helper')
const bedModel = require('../models/cama.models')

module.exports = {
  
  async getBeds(req, res) {
    try {
      try {
        const beds = await bedModel.getBedsModel()

        if(!beds)
          return res.status(404).json({ message: 'no se ha encontrado los registros de la CAMA'})
        res.status(201).json({ message: 'se ha obtenido los CAMAS correctamente!!!', data: beds})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los CAMAS', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },
}
