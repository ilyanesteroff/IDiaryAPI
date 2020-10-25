const createTodo = require('../graphql/resolvers/create-todo')
const { mongoConnect } = require('../js/utils/db-connection')
const { client1 } = require('./utils/client')

const todoInput = {
  task: 'test create todo function',
  completed: false,
  public: false
}

const create = async _ => {
  try{
    const newTodo = await createTodo(todoInput, client1)
    console.log(newTodo)
  } catch (err) {
    console.log(err.message)
  }
}

mongoConnect(_ => create())
