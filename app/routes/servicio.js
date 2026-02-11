const express = require('express')
const router = express.Router()


const { saveService, getServices, modifyService, getService } = require('../controllers/servicio.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, saveService)
router.get('/', checkToken, getServices)
router.get('/:id_servicio', checkToken, getService)
router.put('/', checkToken, modifyService)

module.exports = router