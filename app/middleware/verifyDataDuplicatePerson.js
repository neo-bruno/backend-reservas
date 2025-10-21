const { httpError } = require('../helpers/error.helper')
const PersonModel = require('../models/persona.model')

const verifyDataPerson = async (req, res, next) => {
  try {
    const { documento_persona, telefono_persona } = req.body

    const PersonaCellphone = await PersonModel.getPersonByCellphone(telefono_persona)
    if (PersonaCellphone) {
      return res.status(401).json({ mensaje: "El telefono Celular ya Existe!" });
    }

    const PersonaDocumento = await PersonModel.getPersonByDocument(documento_persona)
    if (PersonaDocumento) {
      return res.status(401).json({ mensaje: "El Documento Personal ya Existe!" });
    }

    if (!PersonaCellphone && !PersonaDocumento) {
      return next()
    }


  } catch (error) {
    httpError(res, error)
  }
}

module.exports = { verifyDataPerson }