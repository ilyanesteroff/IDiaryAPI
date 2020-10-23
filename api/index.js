const express = require('express')
const login = require('./controllers/login')
const countTodosByTag = require('./controllers/count-todos-by-tagname')
const checkIfPwResetIsActual = require('./controllers/if-pw-reset-is-actual')

const router = express.Router()

router.patch('/login', login)

router.get('/countTodosByTag', countTodosByTag)

router.get('./getResetPassword', checkIfPwResetIsActual)

module.exports = router