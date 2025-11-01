const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controllers')

router.post('/register', authController.register)
router.post('/verify', authController.verify)
router.post('/login', authController.login)
router.post('/recover', authController.recover)
router.post('/reset', authController.reset)

module.exports = router
