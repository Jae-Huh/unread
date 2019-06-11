import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import Article from './Article'

function Articles() {
  return (
    <Query
    query={gql`
      {
        articles {
          id
          title
          url
          snippet
          body
          publisher
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return (
        <div>
          {
            data.articles.map(a => {
              return (
                <Article key={a.url} title={a.title} snippet={a.snippet} url={a.url} publisher={a.publisher} />
              )
            })
          }
        </div>
      )
    }}
  </Query>
  )
}


export default Articles
