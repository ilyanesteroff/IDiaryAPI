const viewTodos = require('../../graphql/resolvers/view-todos')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client2, client1 } = require('../utils/client')


const view = async _ => {
  try{
    const todos = await viewTodos(client2._id, 1, client1)
    console.log(todos)
  } catch (err) {
    console.log(err.message) 
  }
}
  
mongoConnect(_ => view())