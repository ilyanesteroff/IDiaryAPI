const writeMessage = require('../../api/controllers/write-message')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  body: {
    to: client2._id,
    text: 'What bout you',
    convId: '5fa93adfc2f78d2930645559'
  }
}

const write = async _ => {
  try {
    await writeMessage(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => write())