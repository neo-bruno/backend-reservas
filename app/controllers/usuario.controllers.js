const { httpError } = require('../helpers/error.helper')
const { encrypt, compare } = require('../helpers/bcrypt.helper')
const { tokenSign } = require('../helpers/token.helper')
const UserModel = require('../models/usuario.models')

const login = async (req, res) => {
  try {
    const { telefono_usuario, contrasena_usuario } = req.body
    const user = await UserModel.findByCellphone(telefono_usuario)

    if (user.id_usuario == 0) {
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

const modifyUser = async (req, res) => {
  try {
    const {
      id_usuario,
      id_rol,
      id_persona,
      nombre_usuario,
      telefono_usuario,
      codigo_pais_usuario,
      contrasena_usuario,
      verificado_usuario,
      email_usuario,
      verificado_phone_usuario,
      verificado_email_usuario,
      metodo_registro_usuario
    } = req.body

    let hashedPassword = null
    
    // 🔐 SOLO si viene contraseña
    if (contrasena_usuario) {
      hashedPassword = await encrypt(contrasena_usuario)
    }    
    const user = await UserModel.modifyUserModel({
      id_usuario,
      id_rol,
      id_persona,
      nombre_usuario,
      telefono_usuario,
      codigo_pais_usuario,
      contrasena_usuario: hashedPassword,
      verificado_usuario,
      email_usuario,
      verificado_phone_usuario,
      verificado_email_usuario,
      metodo_registro_usuario
    })

    if (!user) {
      return res.status(404).json({ message: 'no se ha encontrado el objeto usuario' })
    }

    res.status(200).json({ message: 'Usuario modificado correctamente!' })

  } catch (error) {
    res.status(500).json({
      message: 'error al modificar el objeto usuario',
      error: error.message
    })
  }
}


const register = async (req, res) => {
  try {
    let usuario = req.body

    if (!usuario.codigo_pais_usuario || !usuario.nombre_usuario || !usuario.contrasena_usuario || !usuario.telefono_usuario) {
      return res.status(400).json({ estado: false, mensaje: 'Uno de los Campos esta Vacio: codigo_pais_usuario, nombre_usuario, contrasena_usuario, telefono_usuario' })
    }

    const user = await UserModel.findByCellphone(usuario.telefono_usuario)
    if (user.id_usuario > 0) {
      return res.status(409).json({ estado: false, mensaje: 'El numero Celular ya Existe!' })
    }

    const userEmail = await UserModel.findEmailUnique(usuario.email_usuario)
    if(userEmail.id_usuario > 0){
      return res.status(409).json({ estado: false, mensaje: 'El correo electronico ya Existe!' })
    }

    const hashedPassword = await encrypt(usuario.contrasena_usuario)
    const registerUser = await UserModel.createUser({
      id_rol: usuario.id_rol,
      nombre_usuario: usuario.nombre_usuario,
      telefono_usuario: usuario.telefono_usuario,
      codigo_pais_usuario: usuario.codigo_pais_usuario,
      contrasena_usuario: hashedPassword,
      verificado_usuario: true,
      email_usuario: usuario.email_usuario,
      verificado_phone_usuario: false,
      verificado_email_usuario: true,
      metodo_registro_usuario: ''
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

module.exports = { login, register, getUserPerson, getUserCellphone, modifyUser }