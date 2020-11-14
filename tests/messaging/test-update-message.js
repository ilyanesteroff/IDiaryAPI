//5fafaba76a3f27000423ce2e
const updateMessage = require('../../api/controllers/update-message')
const { Conversation } = require('../../js/models/Conversation')
const { mongoConnect } = require('../../js/utils/db-connection')

const update = async _ => {
  try {
    const result = await Conversation.increaseUnseenMessages('5fafaba76a3f27000423ce2e')
    console.log(result)
  } catch(err) {
    console.log(err.message)
  }
} 

mongoConnect(_ => update())