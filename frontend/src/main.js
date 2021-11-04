import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
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

const getHeaders = async () => {
  const headers = {}
  const instance = await getInstance()
  await waitUntilAuth(instance)
  const token = await instance.getTokenSilently()
  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  return headers
}

// HTTP connection to the API
const httpLink = createHttpLink({
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
