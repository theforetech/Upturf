<template>

  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <vuexy-logo />
      <h2 class="brand-text text-primary ml-1">
        Vuexy
      </h2>
    </b-link>
    <b-col
      v-for="x in categories"
      :key="x"
      lg="4"
      md="6"
    >
      <turf-card
        card-text="///"
      /></b-col>

    <div class="misc-inner p-2 p-sm-3">
      <!--      <div class="w-100 text-center">-->
      <!--        <h2 class="mb-1">-->
      <!--          Page Not Found 🕵🏻‍♀️-->
      <!--        </h2>-->
      <!--        <p class="mb-2">-->
      <!--          Oops! 😖 The requested URL was not found on this server.-->
      <!--        </p>-->

      <!--        <b-button-->
      <!--            variant="primary"-->
      <!--            class="mb-2 btn-sm-block"-->
      <!--            :to="{path:'/'}"-->
      <!--        >-->
      <!--          Back to home-->
      <!--        </b-button>-->

      <!--        &lt;!&ndash; image &ndash;&gt;-->

      <!--      </div>-->
    </div>
  </div>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BLink, BCol } from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import TurfCard from '../../card/card-advance/TurfCard.vue'

export default {
  components: {
    VuexyLogo,
    BLink,
    // BRow,
    BCol,
    TurfCard,

  },

  data() {
    return {
      downImg: require('@/assets/images/pages/error.svg'),
      categories: [
        {
          img: '',
          name: '',
        },
        {
          img: '',
          name: '',
        },
        {
          img: '',
          name: '',
        },
      ],
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/error-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
