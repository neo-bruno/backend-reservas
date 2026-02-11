const express = require('express')
const router = express.Router()

const { getBusiness, saveBusiness, modifyBusiness } = require('../controllers/negocio.controllres')
const { checkToken } = require('../middleware/token.middleware')

router.get('/:tipo_negocio', getBusiness)
router.put('/', checkToken, modifyBusiness)
router.post('/', checkToken, saveBusiness)

module.exports = router