import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat, Observable } from 'apollo-link'
import VueApollo from 'vue-apollo'
import { getInstance } from './auth/auth0-service'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://backend.upturf.in/v1/graphql',
})

export const waitUntilAuth = async authService => new Promise(resolve => {
  const interval = setInterval(() => {
    if (authService && authService.auth0Client !== null) {
      resolve(true)
      clearInterval(interval)
    }
  }, 50)
})

// eslint-disable-next-line no-async-promise-executor
const getHeaders = async () => new Promise(async (resolve, reject) => {
  const instance = await getInstance()
  await waitUntilAuth(instance)
  await instance.getTokenSilently()
  try {
    let token = await instance.getIdTokenClaims() || null
    // eslint-disable-next-line no-underscore-dangle
    token = token.__raw
    resolve(token)
  } catch (e) {
    reject(e)
  }
})

const authMiddleware = new ApolloLink((operation, forward) => new Observable(observable => {
  let sub = null
  getHeaders().then(token => {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}` || null,
      },
    })
    sub = forward(operation).subscribe(observable)
  }).catch(() => {
    sub = forward(operation).subscribe(observable)
  })

  return () => (sub ? sub.unsubscribe() : null)
}))

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: true,
  }),
  defaultOptions: {
    fetchPolicy: 'no-cache',
    // fetchPolicy: 'cache-and-network',
  },
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
