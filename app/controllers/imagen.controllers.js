const { httpError } = require('../helpers/error.helper')
const ImageModel = require('../models/imagen.models')

module.exports = {
  async saveImage(req, res) {
    try {
      try {
        const { id_habitacion, id_negocio, url_imagen, nombre_imagen } = req.body
  
        const level = await ImageModel.saveImageModel({ id_habitacion, id_negocio, url_imagen, nombre_imagen })
  
        if (!level)
          return res.status(404).json({ message: 'no se ha encontrado el objeto imagen'})
        res.status(200).json({ message: 'Imagen Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al registrar el objeto imagen!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },

  async getImages(req, res) {
    try {
      try {
        const images = await ImageModel.getImagesModel()

        if(!images)
          return res.status(404).json({ message: 'no se ha encontrado los registros de IMAGENES'})
        res.status(201).json({ message: 'se ha obtenido las IMAGENES correctamente!!!', data: images})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener las IMAGENES', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getImage(req, res) {
    try {
      const id_imagen = req.params.id_imagen
      try {
        const Image = await ImageModel.getImageModel(id_imagen)

        if(!Image)
          return res.status(404).json({ message: 'no se ha encontrado el objeto IMAGEN'})
        res.status(201).json({ message: 'se ha obtenido la IMAGEN', data: Image})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener la IMAGEN', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyImage(req, res) {
    try {
      try {
        const { id_imagen, id_habitacion, id_negocio, url_imagen, nombre_imagen } = req.body
  
        const Image = await ImageModel.modifyImageModel({ id_imagen, id_habitacion, id_negocio, url_imagen, nombre_imagen })
  
        if (!Image)
          return res.status(404).json({ message: 'no se ha encontrado el objeto Imagen'})
        res.status(200).json({ message: 'Imagen Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al modificar el objeto Imagen!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },
  
}
