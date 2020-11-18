const findTodos = require('../../graphql/resolvers/find-todos-by-tagname')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1, client2 } = require('../utils/client')


const find = async _ => {
  try {
    const todos = await findTodos('tag', 1, client2)
    console.log(todos)
  } catch(err) {
    console.log(err.message)
  }
}

mongoConnect(_ => find())