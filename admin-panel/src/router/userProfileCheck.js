import store from '@/store'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
// eslint-disable-next-line import/prefer-default-export,consistent-return
export const doesProfileExist = async () => {
  if (store.state.user.AppActiveUser.userProfile !== null) {
    return true
  }
  const userProfile = JSON.parse(localStorage.getItem('userProfile'))
  if (userProfile !== null) {
    store.commit('user/UPDATE_USER_PROFILE', userProfile)
  } else {
    const result = await apolloClient.query({
      query: gql`query {
          vendor {
              about
              address
              city
              company
              country
              name
              payment_details
              phone_number
              state
              website
          }
      }`,
    })
    if (result.data !== undefined && result.data.vendor !== undefined && result.data.vendor !== null) {
      if (result.data.vendor.length === 0) {
        return false
      }
      await store.commit('user/UPDATE_USER_PROFILE', result.data.vendor[0])
    }
    await store.commit('user/UPDATE_USER_PROFILE', userProfile)
  }
  return true
}
