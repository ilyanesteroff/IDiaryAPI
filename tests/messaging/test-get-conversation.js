const getConv = require('../../graphql/resolvers/get-conversation')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

  
const view = async _ => {
  try {
    const conv = await getConv('5f9d46c47f16750004a85759', client1)
    console.log(conv)
  } catch(err) {
    console.log(err.message)
  }
} 
 
mongoConnect(_ => view())