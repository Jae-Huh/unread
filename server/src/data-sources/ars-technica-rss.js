const axios = require('axios')
const xmlParser = require('fast-xml-parser')

const updateArticles = require('./data-source-service')

class ArsTechnicaRSS {
  async getNewArticles() {
    async function getData() {
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
      return newArticles
    }

    await updateArticles({ name: 'arstechnica' }, getData)
  }
}

module.exports = ArsTechnicaRSS
