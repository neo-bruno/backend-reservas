const bcrypt = require('bcryptjs')

const encrypt = async ( textPlain ) => {
  const salt = await bcrypt.genSalt(10)  
  const hashedPassword = await bcrypt.hash(textPlain, salt)
  return hashedPassword
}

const compare = async ( passwordPlain, hashedPassword) => {
  return await bcrypt.compare(passwordPlain, hashedPassword)
}

module.exports = {
  encrypt, compare
}