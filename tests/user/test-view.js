//'5f9d7b77202bdb00047c964b'
const viewUser = require('../../graphql/resolvers/view-user')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

const view = async _ => {
  try {
    const user = await viewUser('5f9d7b77202bdb00047c964b', client1)
    console.log(user)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => view())