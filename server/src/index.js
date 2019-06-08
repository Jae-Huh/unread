const { ApolloServer } = require('apollo-server')

const typeDefs = require('./gql-types.js')
const TheVergeRSS = require('./data-sources/the-verge-rss')
const ArsTechnicaRSS = require('./data-sources/ars-technica-rss')
const articlesResolver = require('./resolvers/query/articles')
const thevergeResolver = require('./resolvers/query/theverge')
const arstechnicaResolver = require('./resolvers/query/arstechnica')
const { client } = require('./mongo.js')

const resolvers = {
  Query: {
    articles: articlesResolver,
    theverge: thevergeResolver,
    arstechnica: arstechnicaResolver,
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    thevergeRSS: new TheVergeRSS(),
    arstechnicaRSS: new ArsTechnicaRSS(),
  })
})

async function startServer() {
  await client.connect()

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
}

startServer()
