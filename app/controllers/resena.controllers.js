const { httpError } = require('../helpers/error.helper')
const reviewModel = require('../models/resena.models')

module.exports = {
  async saveReview(req, res) {
    try {
      try {
        const { id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena } = req.body

        const review = await reviewModel.saveReviewModel({ id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena })

        if (!review)
          return res.status(404).json({ message: 'no se ha encontrado el objeto resena' })
        res.status(200).json({ message: 'Resena Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar el objeto resena!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getReview(req, res) {
    try {
      const { id_habitacion, id_usuario } = req.params

      const review = await reviewModel.getReviewModel(
        id_habitacion,
        id_usuario
      )

      // ✅ NO EXISTE → OK
      if (!review) {
        return res.status(200).json({
          message: 'no existe reseña',
          data: {id_resena: 0}
        })
      }

      // ✅ EXISTE → OK
      return res.status(200).json({
        message: 'reseña obtenida correctamente',
        data: review
      })

    } catch (error) {
      return res.status(500).json({
        message: 'error al obtener la reseña',
        error: error.message
      })
    }
  },

  async getAllRevies(req, res) {
    try {      

      const review = await reviewModel.getAllReviesModel()

      // ✅ NO EXISTE → OK
      if (!review) {
        return res.status(200).json({
          message: 'no existe reseña',
          data: {id_resena: 0}
        })
      }

      // ✅ EXISTE → OK
      return res.status(200).json({
        message: 'reseña obtenida correctamente',
        data: review
      })

    } catch (error) {
      return res.status(500).json({
        message: 'error al obtener la reseña',
        error: error.message
      })
    }
  },
  
  async modifyReview(req, res) {
    try {
      try {
        const { id_resena, id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena } = req.body

        const review = await reviewModel.modifyReviewModel({ id_resena, id_habitacion, id_usuario, fecha_resena, puntuacion_resena, comentario_resena, estado_resena })

        if (!review)
          return res.status(404).json({ message: 'no se ha encontrado el objeto resena' })
        res.status(200).json({ message: 'Resena Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al modificar el objeto resena!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

}
