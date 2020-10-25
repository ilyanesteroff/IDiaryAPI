const viewReqs = require('../../graphql/resolvers/requests')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1, client2 } = require('../utils/client')


const view = async _ => {
  try {
    const reqs = await viewReqs(false, 1, client2)
    console.log(reqs)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => view())