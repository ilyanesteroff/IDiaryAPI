const createConv = require('../../api/controllers/create-conversation')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')


const req = {
  user: client1,
  body: {
    receiver: client2._id,
    messageText: 'Hi there'
  }
}

const create = async _ => {
  try { 
    await createConv(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => create())