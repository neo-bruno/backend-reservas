const express = require('express')
const router = express.Router()
const PayController = require('../controllers/pago.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, PayController.savePay)
router.get('/', checkToken, PayController.getPayments)
router.get('/:id_reserva', checkToken, PayController.getAllPaymentsBooking)
router.put('/', checkToken, PayController.modifyPay)

module.exports = router
