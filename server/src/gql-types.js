const { gql } = require("apollo-server")

 const typeDefs = gql`
  type Query {
    placeholder: [Article]!
    theverge: [Article]!
    arstechnica: [Article]!
    articles: [Article]!
  }
  type Article {
    id: ID!
    title: String
    snippet: String,
    body: String,
    url: String,
    publishedTime: Float,
    publisher: String,
  }
`

module.exports = typeDefs
