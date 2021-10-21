<template>
  <div>
    <b-row>
      <b-col
        v-for="x in turfs"
        :key="x.id"
        lg="3"
        md="6"
        xs="12"
      >
        <turf-card
          :card-id="x.id"
          :card-title="x.name"
          :card-image="x.images"
          :turf-avg-cost="x.cost"
          :rating="x.rating"
          :street="x.address"
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
import gql from 'graphql-tag'
import TurfCard from '../../card/card-advance/TurfCard.vue'

export default {
  components: {
    BRow,
    BCol,
    TurfCard,

  },

  data() {
    return {
      turfs2: [
        {
          img: ['/images/turfs/turf1.jpeg', '/images/turfs/turf2.jpg',
          ],
          name: 'Shubham Sports Complex',
          cost: 2,
          rating: 1,
          street: 'Charmwood Village, Faridabad',
          sports: ['/images/sports/Badminton.png', '/images/sports/Football.png', '/images/sports/Rugby.png', '/images/sports/Basketball.png'],
        },
        {
          img: ['/images/turfs/turf1.jpeg', '/images/turfs/turf2.jpg',
          ],
          name: 'Mohan Bagaan',
          cost: 1,
          rating: 5,
          street: 'Grandeur, Allahbad',
          sports: ['/images/sports/Football.png', '/images/sports/Rugby.png', '/images/sports/Basketball.png'],
        },
        {
          img: ['/images/turfs/turf1.jpeg', '/images/turfs/turf2.jpg',
          ],
          name: 'Sports Point',
          cost: 3,
          rating: 2.5,
          street: 'Gomti Nagar, Lucknow',
          sports: ['/images/sports/Badminton.png', '/images/sports/Football.png'],
        },
      ],
      turfs: [],
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
    // console.log('sd')
    this.getTurfs()
  },
  methods: {
    async getTurfs() {
      console.log('sd')
      const result = await this.$apollo.query({
        query: gql`query {
          turf(where: {status: {_neq: false}}) {
            id
            name
            pincode
            city
            address
            images{
              url
            }
            facilities {
              sport{
                id
                name
                images{
                  url
                }
              }
            }
            ratings_aggregate {
              aggregate {
                avg {
                  ratings
                }
              }
            }
          }
        }`,
      })
      this.turfs = result.data.turf.map(turf => {
        const t = {
          ...turf,
          rating: turf.ratings_aggregate.aggregate.avg.ratings,
          sports: [],
        }
        delete t.ratings_aggregate
        delete t.facilities
        const dict = {}
        turf.facilities.forEach(facility => {
          if (!(facility.sport.id in dict)) {
            dict[facility.sport.id] = true
            t.sports.push({
              id: facility.sport.id,
              name: facility.sport.name,
              image: facility.sport.images[0].url,
            })
          }
        })
        return t
      })
      console.log(this.turfs)
    },
  },
}
</script>
