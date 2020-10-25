const updateUserInfo = require('../../graphql/resolvers/update-user-info')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')


const userInput = {
  website: 'www.tester.com',
  about: 'I am a tester'
}

const update = async _ => {
  try {
    const updatedUser = await updateUserInfo(userInput, client1)
    console.log(updatedUser)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())