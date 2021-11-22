<!--suppress ALL -->
<template>
  <div>
    <b-row v-if="turfs.length > 0">
      <b-col
        v-for="x in turfs"
        :key="x.id"
        lg="3"
        md="6"
        xs="12"
      >
        <turf-card
          :key="x.id"
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
    <div v-else>
      <b-alert
        variant="warning"
        show
      >
        <h4 class="alert-heading">
          Ah?
        </h4>
        <div class="alert-body">
          <span>Doctors say not to play much with filters.</span>
        </div>
      </b-alert>
    </div>
  </div>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import { BCol, BRow, BAlert } from 'bootstrap-vue'

import gql from 'graphql-tag'
import { mapGetters } from 'vuex'
import store from '@/store/index'
import TurfCard from '../../card/card-advance/TurfCard.vue'

export default {
  components: {
    BRow,
    BCol,
    BAlert,
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
  watch: {
    filterSports() {
      this.getTurfs()
    },
    filterAmenities() {
      this.getTurfs()
    },
    filterTimings() {
      this.getTurfs()
    },
    // searchQuery(val) {
    //   this.updateSearchQuery(val)
    // },
  },
  computed: {
    ...mapGetters({
      filterDate: 'filters/date',
      filterLocation: 'filters/location',
      filterSortBy: 'filters/sortBy',
      filterLoading: 'filters/loading',
      filterAmenities: 'filters/amenities',
      filterSports: 'filters/sports',
      filterTimings: 'filters/timings',
      filterFourPlus: 'filters/ratingFourPlus',
    }),
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
    this.getTurfs()
  },
  methods: {
    async getTurfs() {
      let filters = '{status: {_neq: false}'
      const variables = {}
      const timings = {
        '06-09': ['06:00:00', '07:00:00', '08:00:00', '09:00:00'],
        '09-12': ['09:00:00', '10:00:00', '11:00:00', '12:00:00'],
        '15-18': ['15:00:00', '16:00:00', '17:00:00', '18:00:00'],
        '18-21': ['18:00:00', '19:00:00', '20:00:00', '21:00:00'],
        '21-00': ['21:00:00', '22:00:00', '23:00:00', '00:00:00'],
      }
      if (this.filterSports.length !== 0) {
        variables.sports = this.filterSports
        filters += ', facilities: {sport: {name: {_in: $sports}}'
      }
      if (this.filterTimings.length !== 0) {
        variables.startTimes = []
        this.filterTimings.forEach(timing => {
          variables.startTimes = [...variables.startTimes, ...timings[timing]]
        })
        if (this.filterSports.length === 0) {
          filters += ', facilities: {slots: {start_time: {_in: $startTimes}}'
        } else {
          filters += ', slots: {start_time: {_in: $startTimes}}'
        }
      }
      // filters += '}'
      if (this.filterTimings.length !== 0 || this.filterSports.length !== 0) {
        filters += '}'
      }
      filters += '}'
      if (this.filterLocation) {
        variables.lat = this.filterLocation.lat
        variables.lon = this.filterLocation.lon
        variables.bound = 20
      }
      const q1 = gql`query ($sports: [String!], $startTimes: [time!]) {
          turf(where: ${filters}) {
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
        }`
      const q2 = gql`query ($sports: [String!], $startTimes: [time!], $bound: Int, $lat: float8, $lon: float8) {
          get_nearby_turfs(where: ${filters}, args: {bound: $bound, latitude: $lat, longitude: $lon}) {
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
        }`
      // console.log(filters)
      const result = await this.$apollo.query({
        query: !this.filterLocation ? q1 : q2,
        variables,
        fetchPolicy: 'no-cache',
      })
      // console.log(result.data.turf)
      const res = !this.filterLocation ? result.data.turf : result.data.get_nearby_turfs
      this.turfs = res.map(turf => {
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
              image: facility.sport.images.length > 0 && facility.sport.images[0].url,
            })
          }
        })
        return t
      })
    },
  },
}
</script>
