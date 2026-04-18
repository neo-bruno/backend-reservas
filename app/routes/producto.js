const express = require('express')
const router = express.Router()
const ProductController = require('../controllers/producto.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/', checkToken, ProductController.getAllProducts)
router.post('/', checkToken, ProductController.saveProduct)
router.put('/', checkToken, ProductController.modifyProduct)

module.exports = router