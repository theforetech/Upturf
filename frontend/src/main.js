import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
// eslint-disable-next-line no-unused-vars
import { ApolloLink, concat, from } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import * as VueGoogleMaps from 'vue2-google-maps'
import { domain, clientId, audience } from './auth/auth0.json'
import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'
// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// Axios Mock Adapter
import '@/@fake-db/db'

import { Auth0Plugin, getInstance } from './auth/auth0-service'

import './registerServiceWorker'

Vue.use(VueApollo)

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname,
    ).then(() => { window.location.reload() })
  },
})

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCWciFpyWPPND6U3gIu6SDlpBeQeb0VxpY',
  },
  installComponents: true,
})

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

// Feather font icon - For form-wizard
// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

async function waitUntilAuth(authService) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (authService && authService.auth0Client !== null) {
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
    console.log(token)
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
  console.log('token')
  console.log(token)
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
    // fetchPolicy: 'no-cache',
  },
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.config.productionTip = false

const { backend } = require('./global-vars')

Vue.prototype.$backend = backend

new Vue({
  router,
  store,
  i18n,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
