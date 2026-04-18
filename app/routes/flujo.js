const express = require('express')
const router = express.Router()
const FlujoController = require('../controllers/flujo.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/:id_caja', checkToken, FlujoController.getFlujos)
router.get('/obtener/:id_flujo', checkToken, FlujoController.getFlujo)
router.post('/', checkToken, FlujoController.saveFlujo)
router.put('/', checkToken, FlujoController.modifyFlujo)
router.delete('/:id_flujo', checkToken, FlujoController.deleteFlujo)

module.exports = router