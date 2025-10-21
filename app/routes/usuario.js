// app/routes/usuario.js
const express = require('express')
const router = express.Router()

const { login, register, getUserCellphone } = require('../controllers/usuario.controllers')
const { checkToken } = require('../middleware/token.middleware')
const { tokenSession } = require('../middleware/verifyToken.middleware')

// Rutas públicas
router.post('/login', login)
router.post('/register', register)
router.get('/:telefono_usuario', checkToken, getUserCellphone)

// Rutas protegidas
router.post('/verificacion/token', tokenSession)

module.exports = router
