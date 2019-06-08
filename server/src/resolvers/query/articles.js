const { client } = require("../../mongo")

async function articleResolver(_, __, context) {
  const db = client.db("test")

  await context.dataSources.thevergeRSS.getNewArticles()
  await context.dataSources.arstechnicaRSS.getNewArticles()

  const articles = await db.collection('articles').find().toArray()

  return articles
}

module.exports = articleResolver
