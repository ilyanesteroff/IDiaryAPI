const createUser = require('../../graphql/resolvers/create-new-user')
const { mongoConnect } = require('../../js/utils/db-connection')

const userInput = {
  firstname: 'tester2',
  lastname: 'tester2',
  username: 'tester2',
  email: 'protech17ilja@gmail.com',
  password: 'password',
  public: true
}

const create = async _ => {
  try{
    const createdUser = await createUser(userInput)
    console.log(createdUser)
  } catch (err) {
    console.log(err.message)
  }
}

mongoConnect(_ => create())
