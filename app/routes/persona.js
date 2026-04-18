const express = require('express')
const router = express.Router()
const PersonController = require('../controllers/persona.controllers')
const { checkToken } = require('../middleware/token.middleware')

router.post('/', checkToken, PersonController.savePerson)
router.post('/fotos/persona', checkToken, PersonController.saveOnlyPerson)
router.post('/registro', checkToken, PersonController.saveRegisterPerson)
router.get('/registro/:id_registro', checkToken, PersonController.getPersons)
router.get('/:id_persona', checkToken, PersonController.getPhotosPerson)
router.get('/', checkToken, PersonController.getAllPersons)
router.delete('/:id_persona/:id_registro', checkToken, PersonController.deletePersonRegister)
router.put('/', checkToken, PersonController.modifyPerson)

module.exports = router
