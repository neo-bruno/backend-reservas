const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/categoria.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, CategoryController.saveCategory)
router.get('/all', CategoryController.getCategories)
router.get('/:id_categoria', checkToken, CategoryController.getCategory)
router.put('/', checkToken, CategoryController.modifyCategory)

module.exports = router