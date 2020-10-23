const updateUserSettings = require('../graphql/resolvers/update-user-settings')
const { mongoConnect } = require('../js/utils/db-connection')

const userInput = {
  public: true,
  phone: '+37120051043' 
}

const client = {
  _id: '5f9314261e4d1c26a8e88a1b'
}

const update = async _ => {
  try {
    const updatedUser = await updateUserSettings(userInput, client)
    console.log(updatedUser)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())