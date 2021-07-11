<template>
  <div>
    <b-row>
      <b-col
        v-for="y in sportCategories"
        :key="y.name"
        lg="3"
        md="4"
        sm="6"
        cols="6"
      >
        <sport-card
          :sport-image="y.img"
          :sport-title="y.name"
        />
      </b-col>
    </b-row>
  </div>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BCol, BRow } from 'bootstrap-vue'

import store from '@/store/index'
// eslint-disable-next-line no-unused-vars
import gql from 'graphql-tag'
// import TurfCard from '../../card/card-advance/TurfCard.vue'
import SportCard from '../../card/card-advance/SportCard.vue'

export default {
  components: {
    BRow,
    BCol,
    // TurfCard,
    SportCard,
  },
  data() {
    return {
      // categories: [
      //   {
      //     img: '/images/turfs/turf1.jpeg',
      //     name: 'Shubham Sports Complex',
      //     cost: '1500',
      //     rating: 1,
      //   },
      //   {
      //     img: '/images/turfs/turf2.jpg',
      //     name: 'Sirifort Stadium',
      //     cost: '1200',
      //     rating: 4,
      //   },
      //   {
      //     img: '/images/turfs/turf3.jpg',
      //     name: 'Lords Stadium',
      //     cost: '12500',
      //     rating: 3,
      //   },
      //   {
      //     img: '/images/turfs/turf4.jpg',
      //     name: 'Panchsheel Badminton Club',
      //     cost: '500',
      //     rating: 2,
      //   },
      // ],
      sportCategories: [
        // {
        //   img: 'http://localhost:8080/images/sports/Badminton.png',
        //   name: 'Badminton',
        // },
        // {
        //   img: 'http://localhost:8080/images/sports/Football.png',
        //   name: 'Football',
        // },
        // {
        //   img: 'http://localhost:8080/images/sports/Basketball.png',
        //   name: 'Basketball',
        // },
        // {
        //   img: 'http://localhost:8080/images/sports/Rugby.png',
        //   name: 'Rugby',
        // },
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
  mounted() {
    this.getSports()
  },
  methods: {
    async getSports() {
      const result = await this.$apollo.query({
        query: gql`query {
            sport {
            disabled
            id
            name
            images {
                url
            }
          }
        }`,
      })
      this.sportCategories = result.data.sport.filter(sport => sport.images.length > 0).map(sport => ({
        name: sport.name,
        img: sport.images[0].url,
      }))
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
