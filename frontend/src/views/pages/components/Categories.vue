<template>
  <div>
    <b-row>
      <b-col
        v-for="x in categories"
        :key="x.name"
        lg="6"
        md="6"
        xs="12"
      >
        <turf-card
          :card-title="x.name"
          :card-image="x.img"
          :turf-cost="x.cost"
          :rating="x.rating"
        /></b-col>
    </b-row>
  </div>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BCol, BRow } from 'bootstrap-vue'

import store from '@/store/index'
import TurfCard from '../../card/card-advance/TurfCard.vue'

export default {
  components: {
    BRow,
    BCol,
    TurfCard,
  },
  data() {
    return {
      categories: [
        {
          img: '/images/turfs/turf1.jpeg',
          name: 'Shubham Sports Complex',
          cost: '1500',
          rating: 1,
        },
        {
          img: '/images/turfs/turf2.jpg',
          name: 'Sirifort Stadium',
          cost: '1200',
          rating: 4,
        },
        {
          img: '/images/turfs/turf3.jpg',
          name: 'Lords Stadium',
          cost: '12500',
          rating: 3,
        },
        {
          img: '/images/turfs/turf4.jpg',
          name: 'Panchsheel Badminton Club',
          cost: '500',
          rating: 2,
        },
      ],
      downImg: require('@/assets/images/pages/error.svg'),
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
