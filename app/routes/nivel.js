const express = require('express')
const router = express.Router()
const LevelController = require('../controllers/nivel.controllres')
const { checkToken } = require('../middleware/token.middleware')

router.post('/register', checkToken, LevelController.saveLevel)
router.get('/todos', checkToken, LevelController.getLevels)
router.get('/:id_nivel', checkToken, LevelController.getLevel)
router.put('/', checkToken, LevelController.modifyLevel)

module.exports = router
