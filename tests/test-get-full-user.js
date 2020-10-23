const getFullUser = require('../graphql/resolvers/get-full-user')
const { mongoConnect } = require('../js/utils/db-connection')

const client = {
  _id: '5f9314261e4d1c26a8e88a1b',
  createdAt: new Date()
}

const get = async _ => {
  try {
    const user = await getFullUser(client)
    console.log(user)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => get())