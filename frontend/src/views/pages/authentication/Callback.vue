<template>
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <Vuexy-logo />
      <h2 class="brand-text text-primary ml-1">
        Upturf
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
    await this.$auth.handleAuthentication()
    // await sleep(3000)
    // if (await this.$auth.isAuthenticated()) await this.$router.push('/').then(() => { window.location.reload() })
  },
  methods: {
    async handleLoginEvent(data) {
      // await sleep(3000)
      this.$ability.update(data.ability)
      if (data.state && data.state !== 'no-redirect') {
        this.$store.commit('app/UPDATE_REDIRECT', data.state)
        if (this.$auth.isAuthenticated()) {
          this.$router.push(data.state || getHomeRouteForLoggedInUser(data.role)).then(() => {
            window.location.reload()
          })
        }
      } else if (this.$auth.isAuthenticated()) {
        this.$router.push(getHomeRouteForLoggedInUser(data.role)).then(() => {
          window.location.reload()
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
