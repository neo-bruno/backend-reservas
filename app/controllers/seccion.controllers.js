const { httpError } = require('../helpers/error.helper')
const sectionModel = require('../models/seccion.models')

module.exports = {
    
  async getSectionByType(req, res) {
    try {
      const tipo_seccion = req.params.tipo_seccion
      try {
        const Section = await sectionModel.getSectionByTypeModel(tipo_seccion)

        if(!Section)
          return res.status(404).json({ message: 'no se ha encontrado el objeto SECCION'})
        res.status(201).json({ message: 'se ha obtenido el SECCION', data: Section})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el SECCION', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifySection(req, res) {
    try {
      try {
        const { id_seccion, id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion, fotos, iconos, pie } = req.body
  
        const level = await sectionModel.modifySectionModel({ id_seccion, id_negocio, tipo_seccion, nombre_seccion, titulo_seccion, subtitulo_seccion, detalle_seccion, descripcion_seccion, url_seccion, video_seccion, fotos, iconos, pie })
  
        if (!level)
          return res.status(404).json({ message: 'no se ha encontrado el objeto nivel'})
        res.status(200).json({ message: 'Nivel Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al modificar el objeto nivel!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyIconSeccion(req, res) {
    try {
      try {
        const { id_icono, id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono } = req.body
  
        const level = await sectionModel.modifyIconSeccionModel({ id_icono, id_seccion, nombre_icono, titulo_icono, subtitulo_icono, descripcion_icono })
  
        if (!level)
          return res.status(404).json({ message: 'no se ha encontrado el objeto Caracteristica'})
        res.status(200).json({ message: 'Caracteristica Modificado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al modificar el objeto Caracteristica!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },
  
}
