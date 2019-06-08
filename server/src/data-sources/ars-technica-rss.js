const axios = require('axios');
const xmlParser = require('fast-xml-parser');

const { client } = require('../mongo')

class ArsTechnicaRSS {
  async getNewArticles() {
    const db = client().db("test");
    const lastUpdatedObject = await db.collection('lastUpdated').findOne({ name: "arstechnica" })
    const lastUpdatedTime = lastUpdatedObject ? lastUpdatedObject.time : 0

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

      const bulkInsert = newArticles.map(a => ({ updateOne: { filter: { id: a.id }, update: { $set: a }, upsert: true } }))

      await db.collection('lastUpdated').updateOne(
        { name: "arstechnica" },
        { $set: { name: "arstechnica", time: Date.now() } },
        { upsert: true }
      );

      await db.collection('articles').bulkWrite(bulkInsert);
      console.log("Updating from RSS Feed")
    }
  }
}

module.exports = ArsTechnicaRSS
