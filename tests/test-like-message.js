const likeMessage = require('../api/controllers/toggle-like-message')
const { mongoConnect } = require('../js/utils/db-connection')
const res = require('./utils/response')
const { client1, client2 } = require('./utils/client')


const req = {
  user: client2,
  body: {
    messageId: '5f95e26871e7cb45605e64a5',
    liked: true
  }
}

const like = async _ => {
  try {
    await likeMessage(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => like())