/* eslint-disable */
import { Ability, AbilityBuilder } from '@casl/ability'
import { initialAbility } from './config'

import { getInstance } from '@/auth/auth0-service'
//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
// const userInfo = JSON.parse(localStorage.getItem('userInfo'))
// // eslint-disable-next-line no-nested-ternary
// const existingAbility = userInfo ? userInfo.ability ? userInfo.ability : null : null

const existingAbility = () => {
  const { can, rules } = new AbilityBuilder(Ability)
  // const instance = getInstance()
  const instance = undefined
  console.log(instance)
  if (instance !== undefined && instance.isAuthenticated) {
    can('manage', 'all')
  } else {
    can('read', 'Auth')
    can('read', 'Home')
    can('read', 'Turf')
    can('read', 'Sports')
  }
  return new Ability(rules)
}

export default new Ability(existingAbility() || initialAbility)
