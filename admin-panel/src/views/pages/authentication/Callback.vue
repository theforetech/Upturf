<template>
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <Vuexy-logo />
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
// eslint-disable-next-line no-unused-vars
import {
  BLink,
} from 'bootstrap-vue'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

// eslint-disable-next-line no-unused-vars
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
export default {
  name: 'Callback',
  components: {
    BLink,
    VuexyLogo,
  },
  async created() {
    // await this.$auth.handleAuthentication()
    // await sleep(500)
    if (await this.$auth.isAuthenticated) {
      await this.$router.push(getHomeRouteForLoggedInUser(this.$auth.user.role))
        .then(() => { window.location.reload() })
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
