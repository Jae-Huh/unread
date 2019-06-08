const MongoClient = require('mongodb').MongoClient;

const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });

module.exports = {
  client,
}
