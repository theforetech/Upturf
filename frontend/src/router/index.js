import Vue from 'vue'
import VueRouter from 'vue-router'

// Routes
import { canNavigate } from '@/libs/acl/routeProtection'
// eslint-disable-next-line no-unused-vars
import { getHomeRouteForLoggedInUser } from '@/auth/utils'
import AuthService from '@/auth'
import apps from './routes/apps'
import dashboard from './routes/dashboard'
import uiElements from './routes/ui-elements/index'
import pages from './routes/pages'
import chartsMaps from './routes/charts-maps'
import formsTable from './routes/forms-tables'
import others from './routes/others'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: { name: 'dashboard-ecommerce' } },
    ...apps,
    ...dashboard,
    ...pages,
    ...chartsMaps,
    ...formsTable,
    ...uiElements,
    ...others,
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// http://localhost:8080/login?redirect=%2Fpages%2Fcomponents%2Fcategories

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = AuthService.isAuthenticated()

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    if (!isLoggedIn) return next({ name: 'auth-login', query: { redirect: to.path } })

    // If logged in => not authorized
    return next({ name: 'redirect-to-dashboard' })
  }
  // Redirect if logged in
  if (to.query.redirect && isLoggedIn) {
    return next(to.query.redirect)
  }
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    return next(getHomeRouteForLoggedInUser(userInfo ? userInfo.userRole : null))
  }
  return next()
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
