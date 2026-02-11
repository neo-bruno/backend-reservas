const express = require('express')
const router = express.Router()
const restrictionController = require('../controllers/restriccion.controllers')

router.post('/register', restrictionController.registerRestriction)
router.get('/:id_habitacion', restrictionController.getRestrictions)
router.put('/', restrictionController.modifyRestriction)

module.exports = router
