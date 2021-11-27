import Vue from 'vue'
import VueRouter from 'vue-router'
// Routes
/* eslint-disable */
// import AuthService from '@/auth'
import pages from './routes/pages'
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { concat } from "apollo-link";
import { InMemoryCache } from "apollo-cache-inmemory";
import { getInstance } from '@/auth/auth0-service/authWrapper'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import store from '@/store'
/* eslint-enable */

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'home' } },
    ...pages,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

async function waitUntilAuth(authService) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (authService.auth0Client !== null) {
        resolve(true)
        clearInterval(interval)
      }
    }, 50)
  })
}

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

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'https://backend.upturf.in/v1/graphql',
  // fetch,
  // headers: getHeaders(),
})

const authMiddleware = setContext((operation, { headers }) => getHeaders().then(token => {
  const head = {
    ...headers,
    authorization: `Bearer ${token}` || null,
  }
  return {
    headers: head,
  }
}).catch(() => ({
  headers,
})))

// Create the apollo client
const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    addTypename: true,
  }),
  defaultOptions: {
    fetchPolicy: 'no-cache',
  },
})

// eslint-disable-next-line consistent-return,import/prefer-default-export
router.beforeEach(async (to, from, next) => {
  const authService = getInstance()
  // eslint-disable-next-line no-empty
  await waitUntilAuth(authService)
  const fn2 = async () => {
    const isLoggedIn = authService.isAuthenticated
    if (isLoggedIn && store.state.user.userProfile === null) {
      await store.dispatch('user/updateUserProfile', apolloClient)
      if (store.state.user.userProfile.length === 0) {
        return next({ name: 'auth-register' })
        // return next({ name: 'auth-register', query: { redirect: to.path } })
      }
    }
    if (!authService.canNavigate(to)) {
      // Redirect to login if not logged in
      if (!isLoggedIn) return next({ name: 'auth-login', query: { redirect: to.path } })

      // If logged in => not authorized
      return next({ name: 'redirect-to-dashboard' })
    }
    // Redirect if logged in
    if (to.query.redirect && isLoggedIn) {
      return next(to.query.redirect)
    }
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
      return next(getHomeRouteForLoggedInUser(authService.user.role))
    }
    return next()
  }
  const fn = () => {
    if (authService.isAuthenticated) {
      return fn2()
    }
    return next({ name: 'auth-login', query: { redirect: to.path } })
  }

  if (!authService.loading && to.name !== 'auth-login') {
    return fn()
  }
  return fn2()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(to => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading && to.path !== '/callback') {
    // appLoading.style.display = 'none'
  }
})

export default router
