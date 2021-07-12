<template>
  <div>
    <b-row>
      <b-col
        v-for="x in turfs"
        :key="x.name"
        lg="3"
        md="6"
        xs="12"
      >
        <turf-card
          :card-title="x.name"
          :card-image="x.img"
          :turf-avg-cost="x.cost"
          :rating="x.rating"
          :street="x.street"
          :sports="x.sports"
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
import TurfCard from '../../card/card-advance/TurfCard.vue'

export default {
  components: {
    BRow,
    BCol,
    TurfCard,

  },

  data() {
    return {
      turfs: [
        {
          img: ['http://localhost:8080/images/turfs/turf1.jpeg', 'http://localhost:8080/images/turfs/turf2.jpg',
          ],
          name: 'Shubham Sports Complex',
          cost: 2,
          rating: 1,
          street: 'Charmwood Village, Faridabad',
        },
        {
          img: ['http://localhost:8080/images/turfs/turf1.jpeg', 'http://localhost:8080/images/turfs/turf2.jpg',
          ],
          name: 'Mohan Bagaan',
          cost: 1,
          rating: 5,
          street: 'Grandeur, Allahbad',
        },
        {
          img: ['http://localhost:8080/images/turfs/turf1.jpeg', 'http://localhost:8080/images/turfs/turf2.jpg',
          ],
          name: 'Mere ghar ke piche',
          cost: 3,
          rating: 2.5,
          street: 'Gomti Nagar, Lucknow',

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
