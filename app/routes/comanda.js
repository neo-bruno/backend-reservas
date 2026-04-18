const express = require('express')
const router = express.Router()
const CommandController = require('../controllers/comanda.controllers')
const { checkToken } = require('../middleware/token.middleware')
const comandaControllers = require('../controllers/comanda.controllers')

router.get('/', checkToken, CommandController.getLastCommand)
router.get('/:id_cuenta', checkToken, CommandController.getCommands)
router.post('/', checkToken, CommandController.saveCommand)
router.post('/consumo', checkToken, comandaControllers.saveConsumption)
router.delete('/:id_comanda', checkToken, CommandController.deleteCommand)

module.exports = router