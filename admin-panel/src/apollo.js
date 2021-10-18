import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, concat, Observable } from 'apollo-link'
import VueApollo from 'vue-apollo'
import AuthService from '@/auth'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://backend.upturf.in/v1/graphql',
})

const authMiddleware = new ApolloLink((operation, forward) => new Observable(observable => {
  let sub = null
  AuthService.isExpiredPromise().then(res => {
    if (res) {
      AuthService.renewTokens().then(() => {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${localStorage.getItem('apollo-token')}`,
          },
        })
        sub = forward(operation).subscribe(observable)
      }).catch(async () => {
        await AuthService.logOut()
      })
    } else {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${localStorage.getItem('apollo-token')}`,
        },
      })
      sub = forward(operation).subscribe(observable)
    }
  })

  return () => (sub ? sub.unsubscribe() : null)
}))

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: true,
  }),
  // defaultOptions: {
  //   fetchPolicy: 'no-cache',
  // },
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
