const express = require('express')
const checkAuthorization = require('./middlewares/authorization-check')
const login = require('./controllers/login')
const countTodosByTag = require('./controllers/count-todos-by-tagname')
const checkIfPwResetIsActual = require('./controllers/if-pw-reset-is-actual')
const acceptEmail = require('./controllers/accept-email')
const requestPwReset = require('./controllers/request-pw-reset')
const setNewPassword = require('./controllers/set-new-password')

const router = express.Router()

router.patch('/login', login)

router.patch('/acceptEmail', acceptEmail)

router.patch('/requestPasswordReset', requestPwReset)

router.patch('/setNewPassword', setNewPassword)

router.get('/countTodosByTag', checkAuthorization, countTodosByTag)

router.get('/getResetPassword', checkIfPwResetIsActual)

module.exports = router