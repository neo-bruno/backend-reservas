const express = require('express')
const router = express.Router()

const { saveRoom, modifyRoom, getRooms, getRoomById, modifyOnlyRoom } = require('../controllers/habitacion.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, saveRoom)
router.put('/', checkToken, modifyRoom)
router.put('/only', checkToken, modifyOnlyRoom)
router.get('/all', getRooms)
router.get('/obtener/:id_habitacion', getRoomById)

module.exports = router
