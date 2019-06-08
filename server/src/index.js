const { ApolloServer } = require('apollo-server');

const typeDefs = require('./gql-types.js')
const TheVergeRSS = require('./data-sources/the-verge-rss')
const ArsTechnicaRSS = require('./data-sources/ars-technica-rss')
const articlesResolver = require('./resolvers/query/articles')
const { client } = require('./mongo.js');

const resolvers = {
  Query: {
    placeholder: (_, __, { dataSources }) => dataSources.jsonPlaceholderAPI.getAllPosts(),
    articles: articlesResolver,
    theverge: async (_, __, context) => {
      const db = client.db("test");
      await context.dataSources.thevergeRSS.getNewArticles()
      const articles = await db.collection('articles').find({ publisher: 'theverge' }).toArray()

      return articles

    },
    arstechnica: async (_, __, context) => {
      const db = client.db("test");
      await context.dataSources.arstechnicaRSS.getNewArticles()
      const articles = await db.collection('articles').find({ publisher: 'arstechnica' }).toArray()

      return articles
    },
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    thevergeRSS: new TheVergeRSS(),
    arstechnicaRSS: new ArsTechnicaRSS(),
  })
});

async function startServer() {
  await client.connect();

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer()
