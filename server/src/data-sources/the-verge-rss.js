const axios = require('axios')
const xmlParser = require('fast-xml-parser')

const updateArticles = require('./data-source-service')

class TheVergeRSS {
  async getNewArticles() {
    async function getData() {
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
      }))
      return newArticles
    }

    await updateArticles({ name: 'theverge' }, getData)
  }
}

module.exports = TheVergeRSS
