const express = require('express')
const router = express.Router()

const { saveBooking, getReservations, modifyBooking, reservasActivasInactivas, getReservationsType, saveBookingManual } = require('../controllers/reserva.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, saveBookingManual)
router.post('/register', checkToken, saveBooking)
router.get('/', checkToken, getReservations)
router.get('/:id_usuario/:tipo', checkToken, reservasActivasInactivas)
router.get('/obtener/:id_usuario/:tipo', checkToken, getReservationsType)
router.put('/', checkToken, modifyBooking)

module.exports = router