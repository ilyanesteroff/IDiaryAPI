const express = require('express')
const mongo = require('mongodb')
const {graphqlHTTP} = require('express-graphql')
const { mongoConnect } = require('./js/utils/db-connection')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const { User } = require('./js/models/User')
const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  req.method === 'OPTIONS'
    ? res.sendStatus(200)
    : next()
})

app.use(async (req, res, next) => {
  //check for token in future
  const user = await User.findUser({ _id: new mongo.ObjectID('5f72017c72ee4b3d509c44d8')})
  if(user) {
    req.isAuth = true
    req.user = user
    req.user._id = req.user._id.toString()
  }
  next()
})

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema, 
  rootValue: graphqlResolvers,
  graphiql: true,
  customFormatErrorFn(err) {
    if(!err.originalError) return err
    const {data, message, status} = err.originalError
    return { 
      message: message,
      data: data,
      status: status
    }
  }
}))

mongoConnect(_ => app.listen(3000))