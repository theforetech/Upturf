import Vue from 'vue'
import VueRouter from 'vue-router'
// Routes
/* eslint-disable */
// import AuthService from '@/auth'
import pages from './routes/pages'
import { apolloClient, waitUntilAuth } from "@/apollo"
import { getInstance } from '@/auth/auth0-service/authWrapper'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import store from '@/store'
import admin from "@/router/routes/admin";
import vendor from "@/router/routes/vendor";
import apps from "@/router/routes/apps";
import dashboard from "@/router/routes/dashboard";
import { doesProfileExist } from "@/router/userProfileCheck";
/* eslint-enable */

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'redirect-to-dashboard' } },
    ...admin,
    ...vendor,
    ...apps,
    // ...dashboard,
    ...pages,
    // ...chartsMaps,
    // ...formsTable,
    // ...uiElements,
    // ...others,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// eslint-disable-next-line consistent-return,import/prefer-default-export
router.beforeEach(async (to, from, next) => {
  const authService = getInstance()
  // eslint-disable-next-line no-empty
  await waitUntilAuth(authService)
  const fn2 = async () => {
    const isLoggedIn = authService.isAuthenticated
    // if (isLoggedIn && store.state.user.userProfile === null) {
    //   await store.dispatch('user/updateUserProfile', apolloClient)
    //   if (store.state.user.userProfile.length === 0) {
    //     return next({ name: 'auth-register' })
    //     // return next({ name: 'auth-register', query: { redirect: to.path } })
    //   }
    // }
    if (!authService.canNavigate(to)) {
      // Redirect to login if not logged in
      if (!isLoggedIn) return next({ name: 'auth-login', query: { redirect: to.path } })

      // If logged in => not authorized
      return next({ name: 'redirect-to-dashboard' })
    }
    if (isLoggedIn && to.name !== 'vendor-create-profile' && !await doesProfileExist()) {
      return next({ name: 'vendor-create-profile' })
    } if (isLoggedIn && to.name === 'vendor-create-profile' && await doesProfileExist()) {
      return next(getHomeRouteForLoggedInUser(authService.user.role))
    }
    // Redirect if logged in
    if (to.query.redirect && isLoggedIn) {
      return next(to.query.redirect)
    }
    if (to.meta.redirectIfLoggedIn && isLoggedIn) {
      return next(getHomeRouteForLoggedInUser(authService.user.role))
    }
    return next()
  }
  const fn = () => {
    if (authService.isAuthenticated) {
      return fn2()
    }
    return next({ name: 'auth-login', query: { redirect: to.path } })
  }

  if (!authService.loading && to.name !== 'auth-login') {
    return fn()
  }
  return fn2()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(to => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading && to.path !== '/callback') {
    appLoading.style.display = 'none'
  }
})

export default router
