const sendRequest = require('../../api/controllers/send-follow-request')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client2,
  body: {
    to: client1._id
  }
}

const send = async _ => {
  try {
    await sendRequest(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => send())