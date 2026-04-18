const { httpError } = require('../helpers/error.helper')
const personModel = require('../models/persona.models')

module.exports = {
  async savePerson(req, res) {
    try {
      try {
        const dato = req.body
        const persona = await personModel.savePersonModel(dato)
        if (!persona)
          return res.status(404).json({ message: 'no se ha encontrado la persona' })
        res.status(200).json({ message: 'Datos de la Persona Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar los datos persona!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveOnlyPerson(req, res) {
    try {
      try {
        const dato = req.body
        const persona = await personModel.saveOnlyPersonModel(dato)
        if (!persona)
          return res.status(404).json({ message: 'no se ha encontrado la persona' })
        res.status(200).json({ message: 'Datos de la Persona Registrado correctamente!', persona })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar los datos persona!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

  async saveRegisterPerson(req, res) {
    try {
      try {
        const dato = req.body
        const registro_persona = await personModel.saveRegisterPersonModel(dato)
        if (!registro_persona)
          return res.status(404).json({ message: 'no se ha encontrado el Registro Persona' })
        res.status(200).json({ message: 'Datos del Registro Persona Registrado correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al registrar los datos del Registro Persona!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },


  async getPersons(req, res) {
    try {
      const { id_registro } = req.params

      const personas = await personModel.getPersonsModel(id_registro)

      return res.status(200).json({
        message: 'se ha obtenido las PERSONAS correctamente!!!',
        data: personas || []
      })

    } catch (error) {
      return res.status(500).json({
        message: 'error al obtener las PERSONAS',
        error: error.message
      })
    }
  },

  async getPhotosPerson(req, res) {
    try {
      const { id_persona } = req.params

      console.log(id_persona)
      const personas = await personModel.getPhotosPersonModel(id_persona)
      return res.status(200).json({
        message: 'se ha obtenido las PERSONAS correctamente!!!',
        data: personas || []
      })

    } catch (error) {
      return res.status(500).json({
        message: 'error al obtener las PERSONAS',
        error: error.message
      })
    }
  },

  async getAllPersons(req, res) {
    try {
      const personas = await personModel.getAllPersonsModel()

      if (!personas || personas.length === 0) {
        return res.status(404).json({
          message: 'no se ha encontrado los registros de la PERSONA'
        })
      }

      res.status(201).json({
        message: 'se ha obtenido las PERSONAS correctamente!!!',
        data: personas
      })

    } catch (error) {
      res.status(500).json({
        message: 'error al obtener las PERSONAS',
        error: error.message
      })
    }
  },

  async deletePersonRegister(req, res) {
    try {
      const { id_persona, id_registro } = req.params

      const result = await personModel.deletePersonRegisterModel({
        id_persona,
        id_registro
      })

      return res.status(200).json({
        message: 'PERSONA REGISTRO eliminado correctamente',
        data: result
      })

    } catch (error) {

      if (error.message === 'No se encontró el registro para eliminar') {
        return res.status(404).json({
          message: error.message
        })
      }

      return res.status(500).json({
        message: 'Error al eliminar PERSONA REGISTRO',
        error: error.message
      })
    }
  },

  async modifyPerson(req, res) {
    try {
      try {
        const data = req.body

        const persona = await personModel.modifyPersonModel(data)

        if (!persona)
          return res.status(404).json({ message: 'no se ha encontrado el objeto Persona' })
        res.status(200).json({ message: 'Persona Modificada correctamente!' })
      } catch (error) {
        res.status(500).json({ message: 'error al modificar el objeto Persona!!!', error: error.message })
      }
    } catch (error) {
      httpError(res, error)
    }
  },

}
