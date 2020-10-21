const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const { mongoConnect } = require('./js/utils/db-connection')
const graphqlSchema = require('./graphql/schema')
const graphqlResolvers = require('./graphql/resolvers')
const {auth, cors} = require('./utils/is-auth')
const app = express()

app.use(express.json())

app.use(cors)

app.use(auth)

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

app.use('/', (req, res) => res.send('This is graphql API'))

//mongoConnect(_ => app.listen(process.env.PORT))
mongoConnect(_ => app.listen(3000))