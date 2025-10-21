const { httpError } = require('../helpers/error.helper')
const { encrypt, compare } = require('../helpers/bcrypt.helper')
const { tokenSign } = require('../helpers/token.helper')
const UserModel = require('../models/usuario.models')

const login = async (req, res) => {
  try {
    const { telefono_usuario, contrasena_usuario } = req.body
    
    const user = await UserModel.findByCellphone(telefono_usuario)

    if (!user) {
      res.status(404)
      res.send({ error: 'Usuario no Encontrado' })
      return
    }

    const checkPassword = await compare(contrasena_usuario, user.contrasena_usuario)
    if (!checkPassword) {
      res.status(409)
      res.send({
        error: 'Password Invalido!'
      })
      return
    }
    const tokenSession = await tokenSign(user)
    if (checkPassword) {
      res.send({
        data: user,
        tokenSession
      })
      return
    }

  } catch (error) {
    httpError(res, error)
  }
}

const register = async (req, res) => {
  try {
    let usuario = req.body
    
    if (!usuario.codigo_pais_usuario || !usuario.nombre_usuario || !usuario.contrasena_usuario || !usuario.telefono_usuario) {
      return res.status(400).json({ estado: false, mensaje: 'Uno de los Campos esta Vacio: codigo_pais_usuario, nombre_usuario, contrasena_usuario, telefono_usuario' })
    }
    
    const user = await UserModel.findByCellphone(usuario.telefono_usuario)
    if (user.telefono_usuario) {
      return res.status(409).json({ estado: false, mensaje: 'El numero Celular ya Existe!' })
    }

    const hashedPassword = await encrypt(contrasena_usuario)
    const registerUser = await UserModel.createUser({      
      rol_usuario,
      nombre_usuario,
      telefono_usuario,
      codigo_pais_usuario,
      contrasena_usuario: hashedPassword,
      verificado_usuario,
      fecha_creacion_usuario      
    })
    const tokenSession = await tokenSign(registerUser)

    res.send({
      data: registerUser,
      tokenSession
    })
    
  } catch (error) {
    httpError(res, error)
  }
}

const getUserPerson = async (req, res) => {
  try {
    const id_persona = req.params.id_persona
    const Person = await UserModel.getUser(id_persona)

    if (!Person) {
      return res.status(400).json({ estado: false, mensaje: 'No hay ningun registro de Persona en la Base de Datos!' })
    }
    res.status(201).send({
      data: Person
    })
  } catch (error) {
    httpError(res, error)
  }
}

const getUserCellphone = async (req, res) => {
  try {
    const telefono_usuario = req.params.telefono_usuario
    const User = await UserModel.findByCellphone(telefono_usuario)

    if (!User) {
      return res.status(400).json({ estado: false, mensaje: 'No hay ningun registro del Usuario en la Base de Datos!' })
    }
    res.status(201).send({
      data: User
    })
  } catch (error) {
    httpError(res, error)
  }
}

module.exports = { login, register, getUserPerson, getUserCellphone }