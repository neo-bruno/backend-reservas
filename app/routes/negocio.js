const express = require('express')
const router = express.Router()

const { getBusiness, saveBusiness } = require('../controllers/negocio.controllres')
const { checkToken } = require('../middleware/token.middleware')

router.get('/', checkToken, getBusiness)
router.post('/', checkToken, saveBusiness)

module.exports = router