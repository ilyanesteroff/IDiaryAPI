const updateUser = require('../graphql/resolvers/update-user')
const { mongoConnect } = require('../js/utils/db-connection')
const client = require('./utils/client')

const userInput = {
  firstname: 'updated tester',
  username: 'updatetester12'
}

const update = async _ => {
  try {
    const updatedUser = await updateUser(userInput, client)
    console.log(updatedUser)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())