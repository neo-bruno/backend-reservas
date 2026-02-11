const { httpError } = require('../helpers/error.helper')
const levelModel = require('../models/nivel.models')

module.exports = {
  async saveLevel(req, res) {
    try {
      try {
        const { nombre_nivel, descripcion_nivel, icono_nivel } = req.body
  
        const level = await levelModel.saveLevelModel({ nombre_nivel, descripcion_nivel, icono_nivel })
  
        if (!level)
          return res.status(404).json({ message: 'no se ha encontrado el objeto nivel'})
        res.status(200).json({ message: 'Nivel Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({message: 'error al registrar el objeto nivel!!!', error: error.message })
      }      
    } catch (error) {
      httpError(res, error)
    }
  },

  async getLevels(req, res) {
    try {
      try {
        const levels = await levelModel.getLevelsModel()

        if(!levels)
          return res.status(404).json({ message: 'no se ha encontrado los registros de NIVEL'})
        res.status(201).json({ message: 'se ha obtenido los NIVELES correctamente!!!', data: levels})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener los NIVELES', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async getLevel(req, res) {
    try {
      const id_nivel = req.params.id_nivel
      try {
        const Level = await levelModel.getLevelModel(id_nivel)

        if(!Level)
          return res.status(404).json({ message: 'no se ha encontrado el objeto NIVEL'})
        res.status(201).json({ message: 'se ha obtenido el NIVEL', data: Level})
      } catch (error) {
        res.status(500).json({ message: 'error al obtener el NIVEL', error: error.message})
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async modifyLevel(req, res) {
    try {
      try {
        const { id_nivel, nombre_nivel, descripcion_nivel, icono_nivel } = req.body
  
        const level = await levelModel.modifyLevelModel({ id_nivel, nombre_nivel, descripcion_nivel, icono_nivel })
  
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
  
}
