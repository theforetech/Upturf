import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI, { provide } from '@vue/composition-api'
import * as VueGoogleMaps from 'vue2-google-maps'

import i18n from '@/libs/i18n'
import VueApollo from 'vue-apollo'
import VueGmaps from 'vue-gmaps'
import router from './router'
import store from './store'
import App from './App.vue'
// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// Axios Mock Adapter
import '@/@fake-db/db'

import '@/firebase/firebaseConfig'

// Auth0 Plugin
import AuthPlugin from './plugins/auth'

// const { apolloClient } = require('./apollo')

Vue.use(VueApollo)
Vue.use(AuthPlugin)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCWciFpyWPPND6U3gIu6SDlpBeQeb0VxpY',
  },
  installComponents: true,
})

Vue.use(VueGmaps, {
  key: 'AIzaSyCWciFpyWPPND6U3gIu6SDlpBeQeb0VxpY',
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

// const getHeaders = () => {
//   const headers = {}
//   const token = window.localStorage.getItem('apollo-token')
//   // console.log(token)
//   if (token) {
//     headers.authorization = `Bearer ${token}`
//   }
//   // console.log(headers)
//   return headers
// }

// HTTP connection to the API
const { apolloProvider } = require('./apollo')

Vue.config.productionTip = false

const { backend } = require('./global-vars')

Vue.prototype.$backend = backend

const app = new Vue({
  router,
  store,
  i18n,
  apolloProvider,
  setup() {
    provide('backend', backend)
    provide('apollo', apolloProvider)
  },
  render: h => h(App),
}).$mount('#app')
app.use(apolloProvider)
