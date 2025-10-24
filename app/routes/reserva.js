const express = require('express')
const router = express.Router()

const { saveBooking, getAllBooking, modifyBooking } = require('../controllers/reserva.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, saveBooking)
router.get('/', checkToken, getAllBooking)
router.put('/', checkToken, modifyBooking)

module.exports = router