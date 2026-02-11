const express = require('express') 
const router = express.Router()
const BedController = require('../controllers/cama.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/all', checkToken, BedController.getBeds)

module.exports = router