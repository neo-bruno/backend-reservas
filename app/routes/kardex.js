const express = require('express')
const router = express.Router()
const KardexController = require('../controllers/kardex.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/', checkToken, KardexController.getAllKardexs)
router.post('/', checkToken, KardexController.saveKardex)
router.put('/', checkToken, KardexController.modifyKardex)

module.exports = router