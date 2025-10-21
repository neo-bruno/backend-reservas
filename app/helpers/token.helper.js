const jwt = require('jsonwebtoken')

const tokenSign = async (user) => {
  return jwt.sign({
    cellphone: user.telefono_usuario,
    id_cargo: user.id_cargo
  },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRATION_TIME
    }
  )
}
const verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}
const decodeSign = (token) => {
  return jwt.decode(token, null)
}

module.exports = {
  tokenSign, decodeSign, verifyToken
}