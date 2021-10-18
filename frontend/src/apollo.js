import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const getHeaders = () => {
  const headers = {}
  const token = window.localStorage.getItem('apollo-token')
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  return headers
}

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://backend.upturf.in/v1/graphql',
  fetch,
  headers: getHeaders(),
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: true,
  }),
})

export default { apolloClient }
