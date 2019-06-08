const { client } = require("../../mongo")

async function thevergeResolver(_, __, context) {
  const db = client.db("test")
  await context.dataSources.thevergeRSS.getNewArticles()
  const articles = await db.collection('articles').find({ publisher: 'theverge' }).toArray()

  return articles
}

module.exports = thevergeResolver
