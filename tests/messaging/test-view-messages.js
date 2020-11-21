const viewMessages = require('../../api/controllers/mark-messages-as-viewed')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')
const { Message } = require('../../js/models/Message')
 
const req = {
  user: client1,
  body: {
    convId: '5f95d026194ad5418835375c'
  }
}

const view = async _ => {
  try {
    await Message.viewMessages('5fb542af3a2b3a00046d34c9', '5f9d7b77202bdb00047c964b')
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => view())