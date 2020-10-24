const rl = require('./utils/readline')
const verify =  require('../api/controllers/veify-password')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')
const client = require('./utils/client')

const req = {
  body: {},
  user: client
}

const _verify = async _ => {
  try {
    await verify(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => {
  rl.question('enter a password: ', (input) => {
    req.body.password = input 
    rl.close()
    _verify()
  })
})
