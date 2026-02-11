const express = require('express')
const router = express.Router()
const ReviewController = require('../controllers/resena.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, ReviewController.saveReview)
router.get('/:id_habitacion/:id_usuario', ReviewController.getReview)
router.get('/', ReviewController.getAllRevies)
router.put('/', checkToken, ReviewController.modifyReview)

module.exports = router
