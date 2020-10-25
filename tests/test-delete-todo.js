const deleteTodo = require('../graphql/resolvers/delete-todo')
const { mongoConnect } = require('../js/utils/db-connection')
const { client1 } = require('./utils/client')


const _delete = async _ => {                   
  try {
    const todo = await deleteTodo('5f959f7aeed9a24144e6320e', client1)
    console.log(todo)
  } catch (err) {
    console.log(err.message)
  }
}

mongoConnect(_ => _delete())
