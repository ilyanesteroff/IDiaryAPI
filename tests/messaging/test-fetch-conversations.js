const fetch = require('../../graphql/resolvers/view-conversations')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

const view = async _ => {
    try {
      const convs = await fetch(client1, 1)
      console.log(convs)
    } catch(err) {
      console.log(err.message)
    }
  }
  
  mongoConnect(_ => view()) 