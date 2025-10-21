const { verifyToken } = require('../helpers/token.helper')
const UserModel = require('../models/usuario.models')

const tokenSession = async (req, res, next) => {
  try {
    let token = req.headers.authorization
    
    if (!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    token = token.split(" ")[1]

    try {      
      const tokenSuccess = await verifyToken(token)
      if(tokenSuccess){
        return res.status(201).json({ tokenSession: tokenSuccess });  
      }else{
        return res.status(400).json({ error: "No existe token!" });  
      }

    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: "Invalid token" });
    }
  } catch (error) {
    res.status(409)
    res.send({ error: 'Token invalido!' })
  }
}

module.exports = { tokenSession }