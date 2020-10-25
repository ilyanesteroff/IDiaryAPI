const updateUserSettings = require('../graphql/resolvers/update-user-settings')
const { mongoConnect } = require('../js/utils/db-connection')
const { client2 } = require('./utils/client')

const userInput = {
  public: false
}

const update = async _ => {
  try {
    const updatedUser = await updateUserSettings(userInput, client2)
    console.log(updatedUser)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())