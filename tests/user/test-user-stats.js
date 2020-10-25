const viewStats = require('../../graphql/resolvers/get-user-stats')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1, client2 } = require('../utils/client')


const view = async _ => {
  try {
    const stats = await viewStats(client1)
    console.log(stats)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => view())