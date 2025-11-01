const express = require('express')
const router = express.Router()

const { saveRoom, modifyRoom, getRooms, getRoomById } = require('../controllers/habitacion.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', saveRoom)
router.put('/', modifyRoom)
router.get('/', getRooms)
router.get('/:id_habitacion', getRoomById)

module.exports = router
