<template>
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <Vuexy-logo />
      <h2 class="brand-text text-primary ml-1">
        Surf A Turf
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2
          class="mb-2"
          style="margin-top: -2.5rem;"
        >
          Logging you in
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import VuexyLogo from '@core/layouts/components/Logo.vue'
// import { getHomeRouteForLoggedInUser } from '@/auth/utils'

// eslint-disable-next-line no-unused-vars
// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }
export default {
  name: 'RefreshLogin',
  components: {
    VuexyLogo,
  },
  created() {
    if (this.$auth.isAuthenticated()) {
      if (this.$store.state.app.redirectAfterLogin) {
        const url = this.$store.state.app.redirectAfterLogin
        this.$store.commit('app/UPDATE_REDIRECT', null)
        this.$router.push(url)
        return
      }
      this.$router.push({ name: 'home' })
    } else {
      this.$router.push({ name: 'auth-control' })
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
