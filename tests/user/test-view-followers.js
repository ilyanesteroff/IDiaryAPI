const viewFollowers = require('../../graphql/resolvers/view-followers')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client2 } = require('../utils/client')

const view = async _ => {
  try {
    const followers = await viewFollowers('5f9d46c47f16750004a85759', 1, client2)
    console.log(followers)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => view())