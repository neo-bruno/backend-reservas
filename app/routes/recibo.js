const express = require('express')
const router = express.Router()
const ReciboControllers = require('../controllers/recibo.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, ReciboControllers.saveReceipt)
router.get('/all/:id_registro', checkToken, ReciboControllers.getAllReceipt)
router.get('/:numero_recibo', checkToken, ReciboControllers.getReceipt)
router.get('/', checkToken, ReciboControllers.getLastReceipt)

module.exports = router
