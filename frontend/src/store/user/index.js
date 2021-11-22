// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

// *From Auth - Data will be received from auth provider
import gql from 'graphql-tag'

const userDefaults = {
  uid: 0, // From Auth
  displayName: 'John Doe', // From Auth
  about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
  // eslint-disable-next-line global-require
  photoURL: require('@/assets/images/portrait/small/avatar-s-11.jpg'), // From Auth
  status: 'online',
  userRole: 'admin',
}
// eslint-disable-next-line no-unused-vars
const delay = ms => new Promise(res => setTimeout(res, ms))
const userInfoLocalStorage = {}

// Set default values for active-user
// More data can be added by auth provider or other plugins/packages
// eslint-disable-next-line no-unused-vars
const getUserInfo = () => {
  const userInfo = {}

  // Update property in user
  Object.keys(userDefaults).forEach(key => {
    // If property is defined in localStorage => Use that
    userInfo[key] = userInfoLocalStorage[key] ? userInfoLocalStorage[key] : userDefaults[key]
  })

  // // Include properties from localStorage
  // Object.keys(userInfoLocalStorage).forEach(key => {
  //   if (userInfo[key] === undefined && userInfoLocalStorage[key] !== null) userInfo[key] = userInfoLocalStorage[key]
  // })

  return userInfo
}

export default {
  namespaced: true,
  state: {
    AppActiveUser: getUserInfo(),
    userProfile: null,
  },
  getters: {
    getActiveUser(state) {
      return state.AppActiveUser
    },
    getUserProfile(state) {
      return state.userProfile
    },
  },
  mutations: {
    UPDATE_USER_PROFILE(state, payload) {
      state.userProfile = payload
    },
    APPEND_TO_USER_WISHLIST(state, payload) {
      state.userProfile[0].wishlists.push(payload)
    },
    DELETE_FROM_USER_WISHLIST(state, payload) {
      const index = state.userProfile[0].wishlists.indexOf(payload)
      if (index > -1) {
        state.userProfile[0].wishlists.splice(index, 1)
      }
    },
    // Updates user info in state and localstorage
    async UPDATE_USER_INFO(state, payload) {
      // Get Data localStorage
      const userInfo = state.AppActiveUser

      // eslint-disable-next-line no-restricted-syntax
      for (const property of Object.keys(payload)) {
        if (payload[property] !== null) {
          // If some of user property is null - user default property defined in state.AppActiveUser
          state.AppActiveUser[property] = payload[property]

          // Update key in localStorage
          userInfo[property] = payload[property]
        }
      }
      // Store data in localStorage
      // await localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
  },
  actions: {
    updateUserInfo({ commit }, payload) {
      commit('UPDATE_USER_INFO', payload)
    },
    // eslint-disable-next-line no-unused-vars
    async updateUserProfile({ commit }, payload) {
      const result = await payload.query({
        query: gql`query {
            user_profile {
                default_city
                lat
                locName
                lon
                name
                phone_number
                wishlists {
                    turf_id
                }
            }
        }`,
      })
      const data = result.data.user_profile.map(profile => {
        const t = {
          ...profile,
          wishlists: [],
        }
        profile.wishlists.forEach(wishlist => {
          t.wishlists.push(wishlist.turf_id)
        })
        return t
      })
      commit('UPDATE_USER_PROFILE', data)
      let loc = null
      if (data.length > 0) {
        loc = {
          lat: data[0].lat,
          lon: data[0].lon,
        }
        if ('locName' in data[0]) {
          loc.name = data[0].locName
        } else {
          loc.name = data[0].default_city
        }
      }
      commit('filters/UPDATE_LOCATION', loc, { root: true })
    },
    // eslint-disable-next-line no-unused-vars
    async updateWishlist({ commit, dispatch }, payload) {
      const {
        apollo, userId, turfId, type,
      } = payload
      if (type === 'insert') {
        await apollo.mutate({
          mutation: gql`mutation($turfId: bigint) {
              insert_wishlist_one(object: {turf_id: $turfId}) {
                  turf_id
                  user_id
              }
          }`,
          variables: {
            turfId,
          },
        })
        commit('APPEND_TO_USER_WISHLIST', turfId)
      } else {
        await apollo.mutate({
          mutation: gql`mutation($userId: String!, $turfId: bigint!) {
              delete_wishlist_by_pk(turf_id: $turfId, user_id: $userId) {
                  turf_id
                  user_id
              }
          }`,
          variables: {
            turfId,
            userId,
          },
        })
        commit('DELETE_FROM_USER_WISHLIST', turfId)
      }
      // await delay(500)
      // await dispatch('updateUserProfile', apollo)
    },
  },
}
