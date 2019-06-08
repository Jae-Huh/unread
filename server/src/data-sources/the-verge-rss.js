const axios = require('axios');
const xmlParser = require('fast-xml-parser');

const { client } = require('../mongo')

class TheVergeRSS {
  async getNewArticles() {
    const db = client.db("test");
    const lastUpdatedObject = await db.collection('lastUpdated').findOne({ name: "theverge" })
    const lastUpdatedTime = lastUpdatedObject ? lastUpdatedObject.time : 0

    // If there the articles haven't been update for x minutes. Get them from RSS feed.
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

module.exports = TheVergeRSS
