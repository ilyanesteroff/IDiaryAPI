const viewMessages = require('../../api/controllers/mark-messages-as-viewed')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  body: {
    convId: '5f95d026194ad5418835375c'
  }
}

const view = async _ => {
  try {
    await viewMessages(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => view())