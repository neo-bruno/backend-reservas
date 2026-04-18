const express = require('express')
const router = express.Router()
const AccountController = require('../controllers/cuenta.controllres')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, AccountController.saveAccount)
router.get('/', checkToken, AccountController.getAllAccounts)
router.put('/', checkToken, AccountController.modifyAccount)

module.exports = router