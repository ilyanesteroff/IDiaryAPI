const rl = require('./utils/readline')
const login = require('../api/controllers/login')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')

const req = {
  body: {}
}

const _login = async _ => {
  try {
    await login(req, res)
  } catch (err) {
    console.log(err)
  }
}

mongoConnect(_ => {
  rl.question('enter username or email: ', (input) => {
    req.body.email = input
    rl.question('enter a password: ', (input) => {
      req.body.password = input
      rl.close()
      _login()
    })
  })
})