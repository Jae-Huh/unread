const { ApolloServer, gql } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');
const MongoClient = require('mongodb').MongoClient;

const typeDefs = require('./gql-types.js')

const client = new MongoClient('mongodb://localhost:27017');

class TheVergeRSS {
  async getNewArticles() {
    const db = client.db("test");
    const lastUpdatedObject = await db.collection('lastUpdated').findOne({ name: "theverge" })
    const lastUpdatedTime = lastUpdatedObject.time

    // If there the articles haven't been upddate for x minutes. Get them from RSS feed.
    const minutes = 0 * 60000 // 5minutes in ms
    if (new Date().getTime() > lastUpdatedTime + minutes) {
      const vergeRSS = await axios.get('https://www.theverge.com/rss/index.xml')
      const json = xmlParser.parse(vergeRSS.data)
      const newArticles = json.feed.entry.map(a => ({ 
        id: a.id, 
        url: a.id, 
        title: a.title, 
        snippet: '',
        body: a.content,
        publisher: 'theverge',
        publishedTime: a.published,
        timestamp: Date.now(),
      }));
      
      const bulkInsert = newArticles.map(a => ({ updateOne: { filter: { id: a.id }, update: { $set: a }, upsert: true } }))

      await db.collection('lastUpdated').updateOne(
        { name: "theverge" },
        { $set: { name: "theverge", time: Date.now() } },
        { upsert: true }
      );

      await db.collection('articles').bulkWrite(bulkInsert);
      console.log("Updating from RSS Feed")
    }
  }
}

class ArsTechnicaRSS {
  async getNewArticles() {
    const db = client.db("test");

    const lastUpdatedObject = await db.collection('lastUpdated').findOne({name: "arstechnica"})
    const lastUpdatedTime = lastUpdatedObject.time

    const minutes = 0 * 60000 // 5minutes in ms
    if (new Date().getTime() > lastUpdatedTime + minutes) {
      const arsRSS = await axios.get('https://feeds.feedburner.com/arstechnica/index')
      const json = xmlParser.parse(arsRSS.data)
      const newArticles = json.rss.channel.item.map(a => ({ 
        id: a.guid, 
        url: a.guid, 
        title: a.title, 
        snippet: a.description, 
        body: a['content:encoded'],
        publisher: 'arstechnica',
        publishedTime: new Date(a.pubDate).getTime(),
        timestamp: Date.now(),
      }))
      
      const bulkInsert = newArticles.map(a => ({ updateOne: { filter: {id: a.id}, update: {$set: a }, upsert: true } }))
      
      await db.collection('lastUpdated').updateOne(
        {name: "arstechnica"}, 
        {$set: {name: "arstechnica", time: Date.now() }},
        {upsert: true}
      );

      await db.collection('articles').bulkWrite(bulkInsert);
      console.log("Updating from RSS Feed")
    }
  }
}

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
    articles: async (_, __, context) => {
      const db = client.db("test");

      await context.dataSources.thevergeRSS.getNewArticles()
      await context.dataSources.arstechnicaRSS.getNewArticles()

      const articles = await db.collection('articles').find().toArray()

      return articles
    },
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
    jsonPlaceholderAPI: new PlaceholderAPI(),
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
