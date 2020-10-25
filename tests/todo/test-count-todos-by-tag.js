const countTodos = require('../../api/controllers/count-todos-by-tagname')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  params: {
    tag: 'test'
  }
}

const count = async _ => {
  try {
    await countTodos(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => count())