const createTodo = require('../graphql/resolvers/create-todo')
const { mongoConnect } = require('../js/utils/db-connection')
const client = require('./utils/client')

const todoInput = {
  task: 'test create todo function',
  completed: false,
  public: true
}

const create = async _ => {
  try{
    const newTodo = await createTodo(todoInput, client)
    console.log(newTodo)
  } catch (err) {
    console.log(err.message)
  }
}

mongoConnect(_ => create())
