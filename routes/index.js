const route = require('express').Router()
const UserControllers = require('../controllers/UserControllers')
const authentication = require('../middleware/authentication')
const authorization = require('../middleware/authorization')

route.post('/login', UserControllers.login)
route.post('/add', UserControllers.createUser)

route.use(authentication)
route.get('/getAll', UserControllers.getAll)
route.get('/show', UserControllers.getLoggedIn)
route.get('/:accountNumber', UserControllers.findAccount)
route.get('/:identityNumber', UserControllers.findIdentity)

route.put('/:accountNumber', authorization, UserControllers.updateUser)
route.delete('/:accountNumber', authorization, UserControllers.deleteUser)

module.exports = route