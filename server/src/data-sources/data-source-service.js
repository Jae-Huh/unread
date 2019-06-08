const { client } = require('../mongo')

async function updateArticles(selector, getArticles) {
  const db = client.db("test")
  const lastUpdatedObject = await db.collection('lastUpdated').findOne(selector)
  const lastUpdatedTime = lastUpdatedObject ? lastUpdatedObject.time : 0

  // If there the articles haven't been update for x minutes. Get them from RSS feed.
  const minutes = 1 * 60000 // 5minutes in ms
  if (new Date().getTime() > lastUpdatedTime + minutes) {
    const newArticles = await getArticles()
    const bulkInsert = newArticles.map(a => ({ updateOne: { filter: { id: a.id }, update: { $set: a }, upsert: true } }))

    await db.collection('lastUpdated').updateOne(
      selector,
      { $set: { ...selector, time: Date.now() } },
      { upsert: true }
    )

    await db.collection('articles').bulkWrite(bulkInsert)
    console.log("Updating from RSS Feed")
  }
}

module.exports = updateArticles
