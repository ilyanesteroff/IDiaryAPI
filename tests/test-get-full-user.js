const getFullUser = require('../graphql/resolvers/get-full-user')
const { mongoConnect } = require('../js/utils/db-connection')
const client = require('./utils/client')

const get = async _ => {
  try {
    const user = await getFullUser(client)
    console.log(user)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => get())