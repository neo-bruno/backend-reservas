const express = require('express')
const router = express.Router()
const ImageController = require('../controllers/imagen.controllers')
const { checkToken } = require('../middleware/token.middleware')
const { saveFileImage } = require('../middleware/file.middleware')

router.post('/', checkToken, saveFileImage)
router.post('/register', checkToken, ImageController.saveImage)
router.get('/all', checkToken, ImageController.getImages)
router.get('/:id_imagen', checkToken, ImageController.getImage)
router.put('/', checkToken, ImageController.modifyImage)

module.exports = router