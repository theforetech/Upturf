// import ability from './ability'
import { Ability } from '@casl/ability'
import store from '@/store'
import { initialAbility } from './config'

export const canNavigate = to => to.matched.some(route => {
  const userInfo = store.state.user.AppActiveUser
  const existingAbility = userInfo ? userInfo.ability : null

  const ability = new Ability(existingAbility || initialAbility)
  console.log(ability)
  return ability.can(route.meta.action || 'read', route.meta.resource)
})

export const _ = undefined
