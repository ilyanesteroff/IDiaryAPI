const deleteMessage = require('../../api/controllers/delete-message')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')

const req = {
  user: client1,
  params: {
    messageId: '5f95d4329016dc46fc6135cd'
  }
}

const _delete = async _ => {
  try {
    await deleteMessage(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => _delete())