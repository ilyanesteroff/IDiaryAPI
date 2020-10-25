const rejectRequest = require('../api/controllers/reject-follow-request')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')
const { client1, client2 } = require('./utils/client')

const req = {
  user: client2,
  params: {
    reqId: '5f95af4ef9a9a938bc4dcad1'
  }
}

const reject = async _ => {
  try {
    await rejectRequest(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => reject())