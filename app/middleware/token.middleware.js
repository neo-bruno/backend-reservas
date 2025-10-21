// const { verifyToken } = require('../helpers/token.helper')
// const UserModel = require('../models/usuario.model')

// const checkToken = async (req, res, next) => {
//   try {    
//     const token = req.headers.authorization.split(' ').pop()    
//     if(!token){
//       return res.status(401).json({ error: 'token no provisto!'})
//     }
    
//     const tokenVerificado = await verifyToken(token)
    
//     if(!tokenVerificado){
//       return res.status(401).json({ error: 'No existe el token!'})
//     }

//     const cellphone = tokenVerificado.cellphone
//     const user = await UserModel.findByCellphone(cellphone)

//     if(user){
//       next()
//     }
//   } catch (error) {
//     res.status(409)
//     res.send({ error: 'Token invalido!'})
//   }
// }

// module.exports = {checkToken}

const { verifyToken } = require('../helpers/token.helper')
const UserModel = require('../models/usuario.models')

const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'token no provisto!' })
    }

    const token = authHeader.split(' ').pop()
    if (!token) {
      return res.status(401).json({ error: 'token no provisto!' })
    }

    const tokenVerificado = await verifyToken(token)
    if (!tokenVerificado) {
      return res.status(401).json({ error: 'No existe el token!' })
    }

    const cellphone = tokenVerificado.cellphone
    const user = await UserModel.findByCellphone(cellphone)

    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    // Agrega user al req para usarlo luego si quieres
    req.user = user

    next()
  } catch (error) {
    console.error('Error en checkToken:', error)
    return res.status(409).json({ error: 'Token invalido!' })
  }
}

module.exports = { checkToken }
