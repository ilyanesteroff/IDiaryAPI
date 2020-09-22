const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const { mongoConnect } = require('./utils/db-connection')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
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

app.use((req, res, next) => {
  req.isAuth = true
  req.userId = '5f6a493fabfb660d40e53365'
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