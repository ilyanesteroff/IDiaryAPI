const editMessage = require('../../api/controllers/update-message')
const { mongoConnect } = require('../../js/utils/db-connection')
const res = require('../utils/response')
const { client1, client2 } = require('../utils/client')


const req = {
  user: client1,
  body: {
    messageId: '5f95e26871e7cb45605e64a5',
    newText: 'What about you?'
  }
}

const edit = async _ => {
  try {
    await editMessage(req, res)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => edit())