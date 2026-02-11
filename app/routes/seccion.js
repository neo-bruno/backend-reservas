const express = require('express')
const router = express.Router()
const SectionController = require('../controllers/seccion.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/:tipo_seccion', SectionController.getSectionByType)
router.put('/', checkToken, SectionController.modifySection)
router.put('/icono', checkToken, SectionController.modifyIconSeccion)

module.exports = router
