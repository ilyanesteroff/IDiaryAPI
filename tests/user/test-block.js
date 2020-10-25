const unblock = require('../graphql/resolvers/unblock-user')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1, client2 } = require('../utils/client')


const blk = async _ => {
  try {
    const unblocked = await unblock(client2.username, client1)
    console.log(unblocked)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => blk())