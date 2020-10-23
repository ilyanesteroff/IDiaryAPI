const updateUser = require('../graphql/resolvers/update-user')
const { mongoConnect } = require('../js/utils/db-connection')

const userInput = {
  firstname: 'updated tester',
  username: 'updatetester12'
}

const client = {
  _id: '5f9314261e4d1c26a8e88a1b'
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