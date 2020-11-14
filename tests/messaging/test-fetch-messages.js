const _messages = require('../../graphql/resolvers/messages')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

const view = async _ => {
    try {
      const messages = await _messages(1, 'friend1', client1)
      console.log(messages)
    } catch(err) {
      console.log(err.message)
    }
  }
  
  mongoConnect(_ => view())