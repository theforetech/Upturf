<template>
  <device
    type="iPhoneX"
    :border="true"
  >
    <div
      v-if="loading"
    >
      <b-row
        class="vh-100 text-center"
        align-h="center"
        align-v="center"
      ><b-col />
        <b-col
          cols="10"
        >
          <b-img
            src="/images/loading/loading2.gif"
            fluid-growth
            style="height: 20rem;margin:auto"
          />
          <h2 style="margin-left: 1rem">
            Getting Turf! Please be patient.
          </h2>
        </b-col>
        <b-col />
      </b-row>
    </div>
    <div
      v-else
      id="user-profile"
    >
      <b-card
        class="profile-header mb-2"
        img-top
        alt="cover photo"
        body-class="p-0"
      >
        <b-carousel
          id="carousel-interval"
          controls
          indicators
          fade
          :interval="2000"
        >
          <div style="position:absolute;z-index: 2;width: 100%;margin-top: 20px; ">
            <b-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-secondary"
              class="btn-wishlist"
              style="float: left;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;margin-left:1rem;background-color:#dbdbdb!important;"
              @click="navigateBack"
            >
              <feather-icon
                icon="ArrowLeftIcon"
                size="20"
              />
            </b-button>
            <b-button
              v-ripple.400="'rgba(0, 0, 0, 0.15)'"
              variant="gradient-secondary"
              class="btn-wishlist"
              :style="{ backgroundImage: isInWishlist ? 'linear-gradient(47deg, red, orangered)!important' : 'linear-gradient(47deg, #fff, #f8f8f8)!important' }"
              style="float: right;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;margin-right:1rem;box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );"
            >
              <feather-icon
                icon="HeartIcon"
                size="20"
                :style="{ stroke: isInWishlist ? 'white' : 'red', fill: isInWishlist ? 'white' : 'white' }"
                style="stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;"
                class="text-danger"
              />
            </b-button>
            <navigator-share
              :url="url"
              :title="title"
              text="Checkout this turf on Upturf!"
            >
              <template v-slot:clickable>
                <b-button
                  v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                  variant="gradient-secondary"
                  class="btn-wishlist"
                  style="float: right;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;margin-right:1rem;"
                >
                  <feather-icon
                    icon="ShareIcon"
                    size="20"
                  />
                </b-button>
              </template>
            </navigator-share>
          </div>
          <b-carousel-slide
            v-for="y in turfData.images"
            :key="y.id"
            class="carousel-image"
            :img-src="y.url"
          />
        </b-carousel>
        <b-row style="padding: 2rem 0 1rem 1.5rem!important;">
          <b-col>
            <b-card-title style="color: #000;font-weight: lighter;font-size: 1.7rem;margin-bottom: 0.8rem">
              {{ turfData.name }}
            </b-card-title>
            <h5 style="color: #000;font-weight: lighter;">
              {{ turfData.address }}, {{ turfData.city }}
            </h5>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-col
            cols="7"
            style="padding: 0"
          >
            <b-form-rating
              id="rating-lg-no-border"
              no-border
              variant="warning"
              readonly
              :value="turfData.rating"
              size="lg"
              style="font-size: 2rem"
            />
          </b-col>

        </b-row>
        <b-row
          align-h="center"
          style="padding: 1rem 1rem 1rem 1rem; "
        >
          <b-col
            cols="4"
          >
            <b-button
              v-ripple.400="'rgba(2, 2, 2, 0.2)'"
              variant="flat-primary"
              class="btn-icon rounded-circle"
              target="_blank"
              :href="turfData.gMapsBusinessLink"
            >
              <feather-icon
                icon="MapIcon"
                size="34"
                class="feather-icon"
              />
              <span class="btn-name">
                Directions
              </span>
            </b-button>
          </b-col>
          <b-col
            cols="4"
          >
            <b-button
              v-ripple.400="'rgba(2, 2, 2, 0.2)'"
              variant="flat-primary"
              class="btn-icon rounded-circle"
              :href="'Tel:' + turfData.contactPhone"
            >
              <feather-icon
                icon="PhoneCallIcon"
                size="34"
                class="feather-icon"
              />
              <span class="btn-name">
                Call
              </span>
            </b-button>
          </b-col>
          <b-col
            cols="4"
          >
            <b-button

              v-ripple.400="'rgba(2, 2, 2, 0.2)'"
              variant="flat-primary"
              class="btn-icon rounded-circle"
            >
              <feather-icon
                icon="MessageSquareIcon"
                size="34"
                class="feather-icon"
              />
              <span class="btn-name">
                Reviews
              </span>
            </b-button>
          </b-col>
        </b-row>
        <b-row
          align-h="center"
          style="padding-bottom: 1rem"
        >
          <b-col
            v-for="x in turfData.sports"
            :key="x.id"
            cols="1"
            style="padding: 0px"
          >
            <b-img
              :src="x.image"
              alt="browser img"
              class="mr-1"
              width="25"
            />
          </b-col>
        </b-row>

      </b-card>

      <section id="profile-info">
        <b-card
          no-body
          class="card-browser-states"
        >
          <b-card-header>
            <div>
              <b-card-title>
                Facilities
              </b-card-title>
            </div>
          </b-card-header>

          <!-- body -->
          <b-card-body style="padding-bottom: 50px;">
            <VueSlickCarousel
              ref="carousel"
              v-bind="settings"
            >
              <div
                v-for="x in turfData.facilities"
                :key="x.id + x.name + 'sd'"
              >
                <buy-card
                  :facility-i-d="x.id"
                  :turf-i-d="turfID"
                  :facility-name="x.sport.name[0].toUpperCase() + x.sport.name.slice(1)"
                  :facility-type="x.type"
                  :cost="x.price"
                  :weekend-cost="x.weekendPrice"
                  :sport="x.sport.images[0].url"
                />
              </div>
            </VueSlickCarousel>
          </b-card-body>
        </b-card>
        <b-card
          no-body
          class="card-browser-states mb-2"
        >
          <b-card-header>
            <div>
              <b-card-title>
                Map Location
              </b-card-title>
            </div>
          </b-card-header>

          <!-- body -->
          <b-card-body>
            <GmapMap
              ref="mapRef"
              :center="{ lat: turfData.lat, lng: turfData.lon }"
              :zoom="18"
              map-style-id="roadmap"
              :options="{ disableDefaultUI: true }"
              style="width: auto; height: 50vmin"
            >
              <GmapMarker
                :position="{ lat: turfData.lat, lng: turfData.lon }"
                :clickable="true"
                :draggable="false"
              />
            </GmapMap>
          </b-card-body>
        </b-card>
        <b-card
          title="Description"
          class="description"
        >
          <b-card-text>
            {{ turfData.about }}
          </b-card-text>
        </b-card>
        <b-card
          no-body
          class="card-browser-states"
        >
          <b-card-header>
            <div>
              <b-card-title>
                Amenities
              </b-card-title>
            </div>
          </b-card-header>

          <!-- body -->
          <b-card-body>
            <b-card-text class="font-small-2" />
            <div
              v-for="x in amenities"
              :key="x.name"
              class="browser-states"
            >
              <b-media no-body>
                <b-img
                  :src="x.img"
                  alt="browser img"
                  class="mr-1"
                  width="30"
                />
                <h6 class="align-self-center my-auto">
                  {{ x.name }}
                </h6>
              </b-media>
            </div>

          </b-card-body>
        </b-card>

      </section>
    </div>
  </device>
</template>
<style scoped>

.profile-header{
  border-bottom-right-radius: 1rem!important;
  border-bottom-left-radius: 1rem!important;
}
.btn-icon{
  width:100%;
  aspect-ratio:1/1;
}
.feather-icon{
  color: #4B485A;
  width: 100%;
  margin-bottom: 1rem;
}
.btn-name{
  font-size: 1rem;
  color: #4B485A;
  text-align: center!important;
  white-space: nowrap;
}
</style>
<style>
.carousel-image>img{
  border-bottom-right-radius: 1.5rem ;
  border-bottom-left-radius: 1.5rem ;
  height: 18rem!important;
}
</style>
<script>
import {
  BRow,
  BCol,
  BCarousel,
  BCarouselSlide,
  BCard,
  BCardTitle,
  BFormRating,
  BCardHeader,
  BCardText,
  BCardBody,
  BMedia,
  BImg,
  BButton,
} from 'bootstrap-vue'
import gql from 'graphql-tag'
import Ripple from 'vue-ripple-directive'
import VueSlickCarousel from 'vue-slick-carousel'
import NavigatorShare from 'vue-navigator-share'
import device from 'vue-device'
import BuyCard from './BuyCard.vue'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
/* eslint-disable global-require */
export default {
  components: {
    device,
    NavigatorShare,
    BRow,
    BCol,
    BCard,
    BCarousel,
    // eslint-disable-next-line vue/no-unused-components
    BCarouselSlide,
    BCardTitle,
    BFormRating,
    BCardHeader,
    BCardText,
    BCardBody,
    // eslint-disable-next-line vue/no-unused-components
    BMedia,
    BImg,
    BButton,
    // eslint-disable-next-line vue/no-unused-components
    BuyCard,
    // eslint-disable-next-line vue/no-unused-components
    VueSlickCarousel,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      turfID: null,
      profile: null,
      loading: true,
      facilities: [
        {
          facilityName: 'Football',
          facilityType: '5 v 5',
          cost: '500',
          img: '/images/sports/Football.png',
        },
        {
          facilityName: 'Basketball',
          facilityType: '3 v 3',
          cost: '1200',
          img: '/images/sports/Basketball.png',
        },
        {
          facilityName: 'Badminton',
          facilityType: '2 v 2',
          cost: '350',
          img: '/images/sports/Badminton.png',
        },
        {
          facilityName: 'Rugby',
          facilityType: '5 v 5',
          cost: '220',
          img: '/images/sports/Rugby.png',
        },
      ],
      turf: {
        title: 'Ramagya Sport Academy',
        images: ['/images/turfs/turf1.jpeg', '/images/turfs/turf2.jpg',
        ],
        desc: 'Located in the heart of Faridabad, Ramagya Spots Area has one of the best facilities when it comes to football turfs. All COVID-19 Safety norms are followed in this complex.',
        avgRating: 3.5,
        dis: 'Faridabad',
        state: 'Haryana',
        amenities: [1, 2, 4],
        sports: [
          {
            name: 'Badminton',
            img: '/images/sports/Badminton.png',
          },
          {
            name: 'Football',
            img: '/images/sports/Football.png',
          },
          {
            name: 'Rugby',
            img: '/images/sports/Rugby.png',
          },
          {
            name: 'Basketball',
            img: '/images/sports/Basketball.png',
          },

        ],
        toggleWishlist: true,
      },
      turfData: {},
      profileData: { },
      settings: {
        arrow: false,
        dots: true,
        focusOnSelect: true,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 2500,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        touchMove: true,
      },
      amenities: [
        {
          img: '/images/amenities/ac2.png',
          name: 'Full Airconditioned Courts',
        },
        {
          img: '/images/amenities/cafe.png',
          name: 'Inhouse Cafe',
        },
        {
          img: '/images/amenities/fl.png',
          name: 'Flood Lights',
        },
        {
          img: '/images/amenities/dw.png',
          name: 'Clean and Safe drinking water',
        },
        {
          img: '/images/amenities/cctv.png',
          name: 'Security Surveillance for personal belongings',
        },
      ],
      navbarItems: [
        {
          name: 'Directions',
          icon: 'MapIcon',
        },
        {
          name: 'Call',
          icon: 'PhoneCallIcon',
        },
        {
          name: 'Reviews',
          icon: 'MessageSquareIcon',
        },
      ],
    }
  },
  computed: {
    url() {
      return window.location.href
    },
    title() {
      return this.turfData.name
    },
    isInWishlist() {
      return false
    },
  },
  created() {
    this.$http.get('/profile/data').then(res => { this.profileData = res.data })
  },
  mounted() {
    this.profile = this.$store.state.user.userProfile
    this.turfID = this.$route.params.id
    // console.log(this.turfID)
    this.getTurfData()
  },
  methods: {
    async getTurfData() {
      // console.log('sd')
      const result = await this.$apollo.query({
        query: gql`query ($id: bigint!) {
          turf_by_pk(id: $id) {
            id
            name
            pincode
            city
            about
            contactPhone
            lat
            lon
            gMapsBusinessLink
            address
            images{
              url
              id
            }
            facilities {
              id
              type
              price
              weekendPrice
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
        variables: {
          id: this.turfID,
        },
      })
      const turf = result.data.turf_by_pk
      const t = {
        ...turf,
        rating: turf.ratings_aggregate ? turf.ratings_aggregate.aggregate.avg.ratings : null,
        sports: [],
      }
      delete t.ratings_aggregate
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
      this.turfData = t
      const vm = this
      setTimeout(() => {
        vm.loading = false
      }, 750)
      // console.log(this.turfData)
    },
    navigateBack() {
      this.$router.go(-1)
    },
  },
}
/* eslint-disable global-require */
</script>
<style>
.device {
  overflow-x: hidden;
  overflow-y: auto;
}
</style>

<style lang="scss" >
@import '@core/scss/vue/pages/page-profile.scss';
</style>
