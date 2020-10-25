const unsendRequest = require('../../api/controllers/unsend-follow-request')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  params: {
    reqId: '5f95abd55d9bb12a5802d857'
  }
}

const unsend = async _ => {
  try {
    await unsendRequest(req, res)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => unsend())