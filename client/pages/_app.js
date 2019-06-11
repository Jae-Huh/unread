import 'isomorphic-unfetch'
import React from 'react'
import App, { Container } from 'next/app'
import ApolloClient from 'apollo-boost'
import { grey } from '@material-ui/core/colors'

import { ApolloProvider } from "react-apollo";


const client = new ApolloClient({
  uri: "http://localhost:4000"
});

class Layout extends React.Component {
  render () {
    const { children } = this.props
    return (
    <div>
      <style jsx global>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
          }
          body {
            background-color: ${grey[900]};
            color: ${grey[300]};
          }
        `}
      </style>
      {children}
    </div>
    )
  }
}


class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <ApolloProvider client={client}>
        <Container>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Container>
      </ApolloProvider>
    )
  }
}

export default MyApp
