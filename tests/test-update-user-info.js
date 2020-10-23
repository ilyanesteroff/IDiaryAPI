const updateUserInfo = require('../graphql/resolvers/update-user-info')
const { mongoConnect } = require('../js/utils/db-connection')

const userInput = {
  website: 'www.tester.com',
  about: 'I am a tester'
}

const client = {
  _id: '5f9314261e4d1c26a8e88a1b'
}

const update = async _ => {
  try {
    const updatedUser = await updateUserInfo(userInput, client)
    console.log(updatedUser)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())