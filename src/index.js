const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');
const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient('mongodb://localhost:27017');

const typeDefs = gql`
  type Query {
    placeholder: [Article]!
    theverge: [Article]!
    arstechnica: [Article]!
  }
  type Article {
    id: ID!
    title: String
    snippet: String,
    body: String,
    url: String,
  }
`;



class PlaceholderAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://jsonplaceholder.typicode.com';
  }
  async getAllPosts() {
    const response = await this.get('posts');
    return Array.isArray(response)
      ? response.map(launch => this.postsReducer(launch))
      : [];
  }

  postsReducer(post) {
    return {
      id: post.id,
      title: post.title,
      snippet: post.body,
      body: post.body + post.body + post.body
    };
  }
}

const resolvers = {
  Query: { 
    placeholder: (_, __, { dataSources }) => dataSources.jsonPlaceholderAPI.getAllPosts(),
    theverge: async (_, __, { dataSources }) => {
      const vergeRSS = await axios.get('https://www.theverge.com/rss/index.xml')
      const json = xmlParser.parse(vergeRSS.data)
      return json.feed.entry.map(article => ({ id: article.id, title: article.title, body: article.content}))
    },
    arstechnica: async (_, __, { dataSources }) => {
      // const client = new MongoClient('mongodb://localhost:27017');
      // await client.connect();
      const db = client.db("test");

      const lastUpdatedObject = await db.collection('lastUpdated').findOne({name: "arstechnica"})
      const lastUpdatedTime = lastUpdatedObject.time


      const minutes = 5 * 60000 // 5minutes in ms
      if (new Date().getTime() > lastUpdatedTime + minutes) {
        const arsRSS = await axios.get('https://feeds.feedburner.com/arstechnica/index')
        const json = xmlParser.parse(arsRSS.data)
        const newArticles = json.rss.channel.item.map(article => ({ id: article.guid, url: article.guid, title: article.title, snippet: article.description, body: article['content:encoded']}))
        
        const bulkInsert = newArticles.map(a => ({ updateOne: { filter: {id: a.id}, update: {$set: a }, upsert:true } }))
        
        await db.collection('lastUpdated').updateOne(
          {name: "arstechnica"}, 
          {$set: {name: "arstechnica", time: new Date().getTime() }}, 
          {upsert: true}
        );

        // await db.collection('articles').insertMany(newArticles);
        await db.collection('articles').bulkWrite(bulkInsert);
        console.log("Updating from RSS Feed")
      }

      const articles = await db.collection('articles').find().toArray()

      return articles
    },
  }
}



const server = new ApolloServer({ 
  typeDefs,
  resolvers,
  dataSources: () => ({
    jsonPlaceholderAPI: new PlaceholderAPI(),
  })
});

async function startServer() {
  await client.connect();

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer()
