const express = require('express')
const router = express.Router()


const { saveService, getServices } = require('../controllers/servicio.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/', getServices)
router.post('/', saveService)

module.exports = router