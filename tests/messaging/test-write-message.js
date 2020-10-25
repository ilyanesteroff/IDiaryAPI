const writeMessage = require('../../api/controllers/write-message')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  body: {
    to: client2._id,
    text: 'What bout you',
    convId: '5f95d026194ad5418835375c'
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