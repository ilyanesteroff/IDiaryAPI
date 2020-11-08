const request = require('../../api/controllers/find-request-from')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')


const req = {
  body: { userId: client2 },
  user: client1
}
  
const find = async _ => {
  try {
    const result = await request(req, res)
    console.log(result)
  } catch (err) {
    console.log(err)
  }
}

mongoConnect(_ => find())