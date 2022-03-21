<!--suppress ALL -->
<template>
  <div v-if="!loading">
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
  <div v-else>
    <b-row>
      <b-col
        cols="12"
        class="mt-3"
      >
        <b-skeleton-img
          no-aspect
          height="150px"
        />
      </b-col>
      <b-col
        cols="12"
        class="mt-3"
      >
        <b-card>
          <b-skeleton
            animation="wave"
            width="85%"
          />
          <b-skeleton
            animation="wave"
            width="55%"
          />
          <b-skeleton
            animation="wave"
            width="70%"
          />
        </b-card>
      </b-col>
    </b-row>
  </div>
  <!-- / Error page-->
</template>

<script>
/* eslint-disable global-require */
import {
  BCol, BRow, BAlert, BSkeleton, BSkeletonImg, BCard,
} from 'bootstrap-vue'

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
    BCard,
    BSkeleton,
    BSkeletonImg,
  },
  data() {
    return {
      loading: true,
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
    ...mapGetters({
      filterDate: 'filters/date',
      filterLocation: 'filters/location',
      filterSortBy: 'filters/sortBy',
      filterLoading: 'filters/loading',
      filterSearchQuery: 'filters/searchQuery',
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
    filterLocation() {
      this.getTurfs()
    },
    filterSearchQuery() {
      this.getTurfs()
    },
  },
  mounted() {
    this.getTurfs()
  },
  methods: {
    async getTurfs() {
      this.loading = true
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
      if (!this.filterSearchQuery && this.filterLocation) {
        variables.lat = this.filterLocation.lat
        variables.lon = this.filterLocation.lon
        variables.bound = 500
      }
      if (this.filterSearchQuery) {
        variables.search = this.filterSearchQuery
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
      const q3 = gql`query ($search: String!, $sports: [String!], $startTimes: [time!]) {
          search_turfs(args: {search: $search}, where: ${filters}) {
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
        // eslint-disable-next-line no-nested-ternary
        query: this.filterSearchQuery === '' ? !this.filterLocation ? q1 : q2 : q3,
        variables,
        fetchPolicy: 'no-cache',
      })
      // console.log(result.data.turf)
      // eslint-disable-next-line no-nested-ternary
      const res = this.filterSearchQuery === '' ? !this.filterLocation ? result.data.turf : result.data.get_nearby_turfs : result.data.search_turfs
      this.turfs = res.map(turf => {
        const t = {
          ...turf,
          rating: turf.ratings_aggregate.aggregate.avg.ratings,
          sports: [],
        }
        const turfsSet = []
        delete t.ratings_aggregate
        delete t.facilities
        const dict = {}
        turf.facilities.forEach(facility => {
          if (!(facility.sport.id in dict)) {
            dict[facility.sport.id] = true
            if (!turfsSet.includes(facility.sport.name)) {
              turfsSet.push(facility.sport.name)
              t.sports.push({
                id: facility.sport.id,
                name: facility.sport.name,
                image: facility.sport.images.length > 0 && facility.sport.images[0].url,
              })
            }
          }
        })
        return t
      })
      this.loading = false
    },
  },
}
</script>
