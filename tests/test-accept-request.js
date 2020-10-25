const acceptReq = require('../api/controllers/accept-follow-request')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')
const { client1, client2 } = require('./utils/client')

const req = {
  user: client2,
  body: {
    reqId: '5f95c042bd1dab40a02dcd8e'
  }
}
  
const accept = async _ => {
  try {
    await acceptReq(req, res)
  } catch(err) {
    console.log(err.message)
  }
}
  
mongoConnect(_ => accept())
