const express = require('express')
const router = express.Router()
const CajaController = require('../controllers/caja.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, CajaController.saveCaja)
router.get('/', CajaController.getCajaActiva)
router.get('/:id_caja', checkToken, CajaController.getCaja)
router.put('/', checkToken, CajaController.modifyCaja)

module.exports = router