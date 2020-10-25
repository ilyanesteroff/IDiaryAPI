const updateTodo = require('../../graphql/resolvers/update-todo')
const { mongoConnect } = require('../../js/utils/db-connection')
const { client1 } = require('../utils/client')

const todoInput = {
  task: 'test update',
  completed: true,
  tags: [ "test" ]
}

const update = async _ => {                   
  try{
    const todo = await updateTodo(todoInput, '5f95a766638645408876d7c1', client1)
    console.log(todo)
  } catch (err) {
    console.log(err.message)
  }
}

mongoConnect(_ => update())
