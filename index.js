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

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema, 
  rootValue: graphqlResolvers,
  graphiql: true
}))

mongoConnect(_ => app.listen(3000))