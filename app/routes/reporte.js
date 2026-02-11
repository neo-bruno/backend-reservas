const express = require('express')
const router = express.Router()
const LevelController = require('../controllers/reporte.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.get('/', checkToken, LevelController.getYears)
router.get('/:ano', checkToken, LevelController.getReportMonth)
router.get('/meses/:ano', checkToken, LevelController.getMonthsYear)
router.get('/obtener/:ano/:mes', checkToken, LevelController.getMonthlyReport)
router.get('/obtener/:ano/:mes/:tipo', checkToken, LevelController.getReport)
router.get('/obtener/reporte/grafico/:ano/:mes', checkToken, LevelController.getReportGraphic)

module.exports = router
