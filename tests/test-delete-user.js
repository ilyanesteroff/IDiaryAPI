const deleteUser = require('../graphql/resolvers/delete-user')
const { mongoConnect } = require('../js/utils/db-connection')
const { client1 } = require('./utils/client')


const _delete = async _ => {
  try {
    const deleted = await deleteUser(client1)
    console.log(deleted)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => _delete())