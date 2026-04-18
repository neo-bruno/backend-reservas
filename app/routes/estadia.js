const express = require('express')
const router = express.Router()
const StayController = require('../controllers/estadia.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.put('/', checkToken, StayController.modifyStay)

module.exports = router