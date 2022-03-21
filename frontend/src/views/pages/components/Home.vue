<template>
  <div id="user-profile">
    <b-card
      class="profile-header mb-2"
      img-top
      alt="cover photo"
      body-class="p-0"
    >
      <b-carousel
        id="carousel-interval"
        indicators
        fade
        :interval="3000"
      >
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_1.jpg')"
          class="cImg"
        />
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_2.jpg')"
          class="cImg"
        />
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_3.jpg')"
          class="cImg"
        />
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_4.jpg')"
          class="cImg"
        />
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_5.jpg')"
          class="cImg"
        />
        <b-carousel-slide
          :img-src="require('@/assets/images/home_banner/banner_6.jpg')"
          class="cImg"
        />
      </b-carousel>

    </b-card>

    <h3
      style="margin-bottom: 2rem;margin-top:2rem; color: #000"
      class="mt-1"
    >
      What do you wanna play?
    </h3>
    <!--/ search input -->
    <VueSlickCarousel
      ref="carousel"
      v-bind="settings"
    >
      <div
        v-for="y in sportCategories"
        :key="y.img"
      >
        <sport-card
          :sport-name="y.name"
          :sport-image="y.img"
          class="side-scroll"
        />
      </div>
    </VueSlickCarousel>
    <!--    <h3-->
    <!--      style="margin-bottom: 2rem;margin-top:2rem; color: #000"-->
    <!--    >-->
    <!--      Explore Turfs Nearby-->
    <!--    </h3>-->
    <!--    <VueSlickCarousel v-bind="settingsNearby">-->
    <!--      <div-->
    <!--        v-for="x in places"-->
    <!--        :key="x.place"-->
    <!--      >-->
    <!--        <b-media-->
    <!--          no-body-->
    <!--          class="nearby"-->
    <!--        >-->
    <!--          <b-media-aside class="mr-2">-->
    <!--            <b-link :href="x.link">-->
    <!--              <b-img-->
    <!--                :src="x.img"-->
    <!--                width="100"-->
    <!--                rounded-->
    <!--                height="70"-->
    <!--              />-->
    <!--            </b-link>-->
    <!--          </b-media-aside>-->
    <!--          <b-media-body>-->
    <!--            <h6 class="blog-recent-post-title">-->
    <!--              <b-link-->
    <!--                :href="x.link"-->
    <!--                class="text-body-heading"-->
    <!--              >{{ x.place }}-->
    <!--              </b-link>-->
    <!--            </h6>-->
    <!--            <span class="text-muted mb-0">-->
    <!--              {{ x.state }}-->
    <!--            </span>-->
    <!--          </b-media-body>-->
    <!--        </b-media>-->
    <!--      </div>-->
    <!--    </VueSlickCarousel>-->
    <h3
      style="margin-bottom: 2rem;margin-top:2rem; color: #000"
    >
      Top Turfs
    </h3>
    <b-row>
      <b-col
        v-for="x in turfs"
        :key="x.name"
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
</template>
<style scoped>
.side-scroll{
  margin-right: 20px;
}
.nearby{
  margin-bottom: 20px;
}

</style>
<style>
.cImg>img{
  border-radius: 1rem;
}

</style>
<script>
import {
  BLink, BMedia, BImg, BCarousel, BCarouselSlide, BCard, BMediaAside, BMediaBody,
  BRow, BCol,
} from 'bootstrap-vue'
import gql from 'graphql-tag'
// import { Carousel, Slide } from 'vue-snap'

import VueSlickCarousel from 'vue-slick-carousel'
import store from '@/store/index'
import SportCard from '../../card/card-advance/SportCard.vue'
import TurfCard from '../../card/card-advance/TurfCard.vue'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCarousel,
    BCarouselSlide,
    // BCardText,
    // BImg,
    // BMedia,
    // BLink,
    TurfCard,
    // BForm,
    // BInputGroup,
    // BInputGroupPrepend,
    // BFormInput,
    SportCard,
    // Carousel,
    // Slide,
    VueSlickCarousel,
    // BMediaAside,
    // BMediaBody,
  },
  data() {
    return {
      knowledgeBaseSearchQuery: '',
      kb: [],
      sportCategories: [
        {
          img: '/images/sports/Badminton.png',
          name: 'Badminton',
        },
        {
          img: '/images/sports/Football.png',
          name: 'Football',
        },
        {
          img: '/images/sports/Basketball.png',
          name: 'Basketball',
        },
        {
          img: '/images/sports/Rugby.png',
          name: 'Rugby',
        },
        {
          img: '/images/sports/Rugby.png',
          name: 'Swimming',
        },
      ],
      // eslint-disable-next-line global-require
      // sportCategories: [],
      places: [
        {
          img: '/images/places/delhi.jpg',
          link: '#',
          place: 'New Delhi',
          state: 'Delhi',

        },
        {
          img: '/images/places/gurgaon.jpg',
          link: '#',
          place: 'Gurgaon',
          state: 'Haryana',

        },
        {
          img: '/images/places/bangalore.jpg',
          link: '#',
          place: 'Bangalore',
          state: 'Karnataka',

        },
        {
          img: '/images/places/mumbai.jpg',
          link: '#',
          place: 'Mumbai',
          state: 'Maharashtra',

        },
        {
          img: '/images/places/kolkata.jpg',
          link: '#',
          place: 'Kolkata',
          state: 'West Bengal',

        },
      ],
      turfs: [
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
      // eslint-disable-next-line global-require
      downImg: require('@/assets/images/pages/error.svg'),
      settings: {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        touchThreshold: 5,
      },
      settingsNearby: {
        rows: 2,
        slidesPerRow: 1,
        infinite: true,
        speed: 500,
        slidesToShow: 1.04,
        arrows: false,
      },
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties,global-require
        this.downImg = require('@/assets/images/pages/error-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  mounted() {
    this.getSports()
    this.getTurfs()
  },
  methods: {
    async getTurfs() {
      // console.log('sd')
      const result = await this.$apollo.query({
        query: gql`query {
          turf(where: {status: {_neq: false}}, limit: 5) {
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
                image: facility.sport.images[0].url,
              })
            }
          }
        })
        return t
      })
    },
    async getSports() {
      const result = await this.$apollo.query({
        query: gql`query {
          sport(where: {disabled: {_eq: false}}) {
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
@import '@core/scss/vue/pages/page-knowledge-base.scss';
</style>
