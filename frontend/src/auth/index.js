import auth0 from 'auth0-js'
import EventEmitter from 'events'
import store from '@/store'
import authConfig from './auth0.json'

// 'loggedIn' is used in other parts of application. So, Don't forget to change there also
const localStorageKey = 'loggedIn'

const tokenExpiryKey = 'tokenExpiry'
const loginEvent = 'loginEvent'

const webAuth = new auth0.WebAuth({
  domain: authConfig.domain,
  redirectUri: `${window.location.origin + process.env.BASE_URL}callback`,
  clientID: authConfig.clientId,
  responseType: 'id_token',
  scope: 'openid profile email',
})

class AuthService extends EventEmitter {
  idToken = null;

  profile = null;

  tokenExpiry = null;

  // Starts the user login flow
  // eslint-disable-next-line class-methods-use-this
  login(redirect) {
    webAuth.authorize({
      state: redirect,
    })
  }

  // Handles the callback request from Auth0
  handleAuthentication() {
    return new Promise((resolve, reject) => {
      webAuth.parseHash(async (err, authResult) => {
        if (err) {
          // alert(`${err.error}. Detailed error can be found in console.`)
          reject(err)
        } else {
          await this.localLogin(authResult)
          resolve(authResult.idToken)
        }
      })
    })
  }

  async localLogin(authResult) {
    this.idToken = authResult.idToken
    this.profile = authResult.idTokenPayload

    // Convert the JWT expiry time from seconds to milliseconds
    this.tokenExpiry = new Date(this.profile.exp * 1000)
    await localStorage.setItem(tokenExpiryKey, this.tokenExpiry)
    await localStorage.setItem(localStorageKey, 'true')
    await localStorage.setItem('apollo-token', authResult.idToken)

    await store.commit('user/UPDATE_USER_INFO', {
      ability: [{
        action: 'manage',
        subject: 'all',
      }],
      displayName: this.profile.name,
      email: this.profile.email,
      emailVerified: this.profile.email_verified,
      photoURL: this.profile.picture,
      providerId: this.profile.sub.substr(0, this.profile.sub.indexOf('|')),
      uid: this.profile.sub,
      userRole: this.profile['https://hasura.io/jwt/claims']['x-hasura-default-role'],
      role: this.profile['https://hasura.io/jwt/claims']['x-hasura-default-role'],
    })

    this.emit(loginEvent, {
      loggedIn: true,
      profile: authResult.idTokenPayload,
      state: authResult.state || null,
      ability: [{
        action: 'manage',
        subject: 'all',
      }],
      role: this.profile['https://hasura.io/jwt/claims']['x-hasura-default-role'],
    })
  }

  renewTokens() {
    // reject can be used as parameter in promise for using reject
    return new Promise(resolve => {
      if (localStorage.getItem(localStorageKey) !== 'true') {
        // return reject("Not logged in");
      }

      webAuth.checkSession({}, async (err, authResult) => {
        if (err) {
          // reject(err);
        } else {
          await this.localLogin(authResult)
          resolve(authResult)
        }
      })
    })
  }

  logOut() {
    this.idToken = null
    this.tokenExpiry = null
    this.profile = null

    webAuth.logout({
      returnTo: window.location.origin + process.env.BASE_URL,
    })
    localStorage.removeItem(localStorageKey)
    localStorage.removeItem(tokenExpiryKey)
    localStorage.removeItem('userInfo')
    localStorage.removeItem('apollo-token')

    this.emit(loginEvent, {
      loggedIn: false,
      idToken: null,
      ability: [{
        action: 'read',
        subject: 'Auth',
      }],
    })
  }

  // eslint-disable-next-line class-methods-use-this
  isAuthenticated() {
    return (
      new Date(Date.now()) < new Date(localStorage.getItem(tokenExpiryKey))
      && localStorage.getItem(localStorageKey) === 'true'
    )
  }
}

export default new AuthService()
