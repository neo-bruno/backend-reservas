const express = require('express')
const router = express.Router()

const { saveRoom, modifyRoom, getRooms, getRoomById } = require('../controllers/habitacion.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, saveRoom)
router.put('/', checkToken, modifyRoom)
router.get('/', checkToken, getRooms)
router.get('/:id_habitacion', checkToken, getRoomById)

module.exports = router
