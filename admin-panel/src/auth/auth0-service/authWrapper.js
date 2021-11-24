import Vue from 'vue'
import { Ability } from '@casl/ability'
import createAuth0Client from '@auth0/auth0-spa-js'
import store from '@/store'

const DEFAULT_REDIRECT_CALLBACK = () => window.history.replaceState({}, document.title, window.location.pathname)

let instance

export const getInstance = () => instance

export const useAuth0 = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  redirectUri = `${window.location.origin + process.env.BASE_URL}callback`,
  ...options
}) => {
  if (instance) return instance

  instance = new Vue({
    data() {
      return {
        loading: true,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        popupOpen: false,
        error: null,
        ability: new Ability([
          {
            action: 'read',
            subject: 'Auth',
          },
          {
            action: 'read',
            subject: 'Home',
          },
          {
            action: 'read',
            subject: 'Turf',
          },
          {
            action: 'read',
            subject: 'Sports',
          },
        ]),
      }
    },
    async created() {
      this.auth0Client = await createAuth0Client({
        ...options,
        client_id: options.clientId,
        redirect_uri: redirectUri,
      })

      try {
        if (
          window.location.search.includes('code=')
          && window.location.search.includes('state=')
        ) {
          const { appState } = await this.auth0Client.handleRedirectCallback()
          this.error = null
          onRedirectCallback(appState)
        }
      } catch (e) {
        this.error = e
      } finally {
        this.isAuthenticated = await this.auth0Client.isAuthenticated()
        this.user = await this.auth0Client.getUser()
        if (this.user) {
          this.ability = new Ability(this.user['https://upturf.in/rules'])
          await store.commit('user/UPDATE_USER_INFO', {
            ability: this.user['https://upturf.in/rules'],
            displayName: this.user.name,
            email: this.user.email,
            emailVerified: this.user.email_verified,
            photoURL: this.user.picture,
            providerId: this.user.sub.substr(0, this.user.sub.indexOf('|')),
            uid: this.user.sub,
            userRole: this.user['https://hasura.io/jwt/claims']['x-hasura-default-role'],
            role: this.user['https://hasura.io/jwt/claims']['x-hasura-default-role'],
          })
        } else {
          this.ability = new Ability([
            {
              action: 'read',
              subject: 'Auth',
            },
            {
              action: 'read',
              subject: 'Home',
            },
            {
              action: 'read',
              subject: 'Turf',
            },
            {
              action: 'read',
              subject: 'Sports',
            },
          ])
        }
        this.loading = false
      }
    },
    methods: {
      canNavigate(to) {
        return to.matched.some(route => {
          if (!('meta' in route) || !('resource' in route.meta)) return true
          return this.ability.can(route.meta.action || 'read', route.meta.resource)
        })
      },
      // eslint-disable-next-line no-shadow
      async loginWithPopup(options, config) {
        this.popupOpen = true

        try {
          await this.auth0Client.loginWithPopup(options, config)
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = await this.auth0Client.isAuthenticated()
          this.error = null
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
          this.error = e
        } finally {
          this.popupOpen = false
        }
      },
      async handleRedirectCallback() {
        this.loading = true
        try {
          await this.auth0Client.handleRedirectCallback()
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = true
          this.error = null
        } catch (e) {
          this.error = e
        } finally {
          this.isAuthenticated = await this.auth0Client.isAuthenticated()
          this.user = await this.auth0Client.getUser()
          if (this.user) {
            this.ability = new Ability(this.user['https://upturf.in/rules'])
            await store.commit('user/UPDATE_USER_INFO', {
              ability: this.user['https://upturf.in/rules'],
              displayName: this.user.name,
              email: this.user.email,
              emailVerified: this.user.email_verified,
              photoURL: this.user.picture,
              providerId: this.user.sub.substr(0, this.user.sub.indexOf('|')),
              uid: this.user.sub,
              userRole: this.user['https://hasura.io/jwt/claims']['x-hasura-default-role'],
              role: this.user['https://hasura.io/jwt/claims']['x-hasura-default-role'],
            })
          } else {
            this.ability = new Ability([
              {
                action: 'read',
                subject: 'Auth',
              },
              {
                action: 'read',
                subject: 'Home',
              },
              {
                action: 'read',
                subject: 'Turf',
              },
              {
                action: 'read',
                subject: 'Sports',
              },
            ])
          }
          this.loading = false
        }
      },
      loginWithRedirect(o) {
        return this.auth0Client.loginWithRedirect(o)
      },
      getIdTokenClaims(o) {
        return this.auth0Client.getIdTokenClaims(o)
      },
      getTokenSilently(o) {
        return this.auth0Client.getTokenSilently(o)
      },
      getTokenWithPopup(o) {
        return this.auth0Client.getTokenWithPopup(o)
      },
      logout(o) {
        this.ability = new Ability([
          {
            action: 'read',
            subject: 'Auth',
          },
          {
            action: 'read',
            subject: 'Home',
          },
          {
            action: 'read',
            subject: 'Turf',
          },
          {
            action: 'read',
            subject: 'Sports',
          },
        ])
        if (!o) {
          // eslint-disable-next-line no-param-reassign
          o = {
            returnTo: window.location.origin,
          }
        } else if (!('returnTo' in o)) {
          // eslint-disable-next-line no-param-reassign
          o.returnTo = window.location.origin
        }
        return this.auth0Client.logout(o)
      },
    },
  })

  return instance
}

export const Auth0Plugin = {
  // eslint-disable-next-line no-shadow
  install(Vue, options) {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$auth = useAuth0(options)
  },
}
