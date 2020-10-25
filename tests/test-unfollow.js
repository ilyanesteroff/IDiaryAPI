const unfollow = require('../api/controllers/unfollow')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')
const { client1, client2 } = require('./utils/client')

const req = {
  user: client2,
  params: {
    followId: '5f95b980d5bc0b1b50ccd4fa'
  }
}
  
const _unfollow = async _ => {
  try {
    await unfollow(req, res)
  } catch(err) {
    console.log(err.message)
  }
}
  
mongoConnect(_ => _unfollow())