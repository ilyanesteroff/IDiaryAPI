const readline = require('readline')
const login = require('../api/controllers/login')
const { mongoConnect } = require('../js/utils/db-connection')


const res = {
  json: function(_res) {
    console.log(_res)
  },
  status: function(s) {
    this.statusCode = s
    return this
  }
}
  
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

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