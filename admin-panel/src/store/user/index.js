// /////////////////////////////////////////////
// Helper
// /////////////////////////////////////////////

// *From Auth - Data will be received from auth provider
const userDefaults = {
  uid: null, // From Auth
  displayName: 'John Doe', // From Auth
  about: 'Dessert chocolate cake lemon drops jujubes. Biscuit cupcake ice cream bear claw brownie brownie marshmallow.',
  // eslint-disable-next-line global-require
  photoURL: require('@/assets/images/portrait/small/avatar-s-11.jpg'), // From Auth
  status: 'online',
  userRole: 'admin',
  userProfile: null,
}

const userInfoLocalStorage = JSON.parse(localStorage.getItem('userInfo')) || {}

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

  // Include properties from localStorage
  Object.keys(userInfoLocalStorage).forEach(key => {
    if (userInfo[key] === undefined && userInfoLocalStorage[key] !== null) userInfo[key] = userInfoLocalStorage[key]
  })

  return userInfo
}

export default {
  namespaced: true,
  state: {
    AppActiveUser: getUserInfo(),
  },
  getters: {},
  mutations: {
    // Updates user info in state and localstorage
    async UPDATE_USER_INFO(state, payload) {
      // Get Data localStorage
      const userInfo = await JSON.parse(await localStorage.getItem('userInfo')) || state.AppActiveUser

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
      await localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    async UPDATE_USER_PROFILE(state, payload) {
      if (payload === undefined || payload === null) {
        state.AppActiveUser.userProfile = null
        await localStorage.removeItem('userProfile')
        return
      }
      // Get Data localStorage
      const userProfile = await JSON.parse(await localStorage.getItem('userProfile')) || {}
      if (!state.AppActiveUser.userProfile) {
        state.AppActiveUser.userProfile = {}
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const property of Object.keys(payload)) {
        if (payload[property] !== null) {
          // If some of user property is null - user default property defined in state.AppActiveUser
          state.AppActiveUser.userProfile[property] = payload[property]

          // Update key in localStorage
          userProfile[property] = payload[property]
        }
      }
      // Store data in localStorage
      await localStorage.setItem('userProfile', JSON.stringify(userProfile))
    },
  },
  actions: {
    updateUserInfo({ commit }, payload) {
      commit('UPDATE_USER_INFO', payload)
    },
  },
}
