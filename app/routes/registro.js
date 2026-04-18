const express = require('express')
const router = express.Router()
const RegisterController = require('../controllers/registro.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, RegisterController.saveRegister)
router.post('/reserva', checkToken, RegisterController.saveRegisterBooking)
router.post('/manual/checkIn', checkToken, RegisterController.saveRegisterManual)
router.get('/:id_habitacion/:estado_registro', checkToken, RegisterController.getRegister)
router.get('/', checkToken, RegisterController.getLastRegister)
router.put('/', checkToken, RegisterController.modifyRegister)
module.exports = router
