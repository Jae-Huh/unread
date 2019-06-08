const { client } = require("../../mongo")

async function arstechnicaResolver(_, __, context) {
  const db = client.db("test")
  await context.dataSources.arstechnicaRSS.getNewArticles()
  const articles = await db.collection('articles').find({ publisher: 'arstechnica' }).toArray()

  return articles
}

module.exports = arstechnicaResolver
