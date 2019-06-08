const axios = require('axios')
const xmlParser = require('fast-xml-parser')
const HTMLParser = require('node-html-parser')
const he = require('he')

const updateArticles = require('./data-source-service')

const parserOptions = {
  attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),
  tagValueProcessor : a => he.decode(a)
}

class TheVergeRSS {
  async getNewArticles() {
    async function getData() {
      const vergeRSS = await axios.get('https://www.theverge.com/rss/index.xml')
      const json = xmlParser.parse(vergeRSS.data, parserOptions)
      const newArticles = json.feed.entry.map((a, i) => {
        const rootDOM = HTMLParser.parse(a.content)
        let snippet = ""

        try {
          const snippetWithLinks = rootDOM.querySelectorAll("p")[0].innerHTML.toString()
          // const linkRegex = /<(\/?)(a)[^>]{0,}>/g
          const allTagsRegex = /<(\/?)[^>]{0,}>/g
          snippet = snippetWithLinks.replace(allTagsRegex, "")
        } catch (e) {
          console.log("Error parsing html")
        }

        return {
          id: a.id,
          url: a.id,
          title: a.title,
          snippet: snippet,
          body: a.content,
          publisher: 'theverge',
          publishedTime: a.published,
          timestamp: Date.now(),
        }
      })
      return newArticles
    }

    await updateArticles({ name: 'theverge' }, getData)
  }
}

module.exports = TheVergeRSS
