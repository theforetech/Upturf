<template>
  <div
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
          >
            <feather-icon
              icon="ArrowLeftIcon"
              size="25"
            />
          </b-button>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-danger"
            class="btn-wishlist"
            style="float: right;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;margin-right:1rem;"
          >
            <feather-icon
              icon="HeartIcon"
              size="25"
            />
          </b-button>
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-secondary"
            class="btn-wishlist"
            style="float: right;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;margin-right:1rem;"
          >
            <feather-icon
              icon="ShareIcon"
              size="25"
            />
          </b-button>
        </div>
        <b-carousel-slide
          v-for="y in turf.images"
          :key="y"
          class="carousel-image"
          :img-src="y"
        />
      </b-carousel>
      <b-row style="padding: 2rem 0 1rem 1.5rem!important;">
        <b-col>
          <b-card-title style="color: #000;font-weight: lighter;font-size: 1.7rem;margin-bottom: 0.8rem">
            {{ turf.title }}
          </b-card-title>
          <h5 style="color: #000;font-weight: lighter;">
            {{ turf.dis }}, {{ turf.state }}
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
            :value="turf.avgRating"
            size="lg"
            style="font-size: 2rem"
          />
        </b-col>

      </b-row>
      <b-row
        align-h="center"
        style="padding: 1rem 1rem 1rem 1rem"
      >
        <b-col
          v-for="x in navbarItems"
          :key="x.name"
          cols="4"
        >
          <b-button

            v-ripple.400="'rgba(2, 2, 2, 0.2)'"
            variant="flat-primary"
            class="btn-icon rounded-circle"
          >
            <feather-icon
              :icon="x.icon"
              size="34"
              class="feather-icon"
            />
            <span class="btn-name">
              {{ x.name }}
            </span>
          </b-button></b-col>
      </b-row>
      <b-row
        align-h="center"
        style="padding-bottom: 1rem"
      >
        <b-col
          v-for="x in turf.sports"
          :key="x.img"
          cols="1"
          style="padding: 0px"
        >
          <b-img

            :src="x.img"
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
        <b-card-body>
          <VueSlickCarousel
            ref="carousel"
            v-bind="settings"
          >
            <div
              v-for="x in facilites"
              :key="x"
            >
              <buy-card
                :facility-name="x.facilityName"
                :facility-type="x.facilityType"
                :cost="x.cost"
                :sport="x.img"
              />
            </div>
          </VueSlickCarousel>
          <!--          <buy-card-->
          <!--            v-for="x in facilites"-->
          <!--            :key="x"-->
          <!--            :facility-name="x.facilityName"-->
          <!--            :facility-type="x.facilityType"-->
          <!--            :cost="x.cost"-->
          <!--            :sport="x.img"-->
          <!--          />-->
        </b-card-body>
      </b-card>
      <b-card
        title="Description"
        class="description"
      >
        <b-card-text>
          {{ turf.desc }}
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
            :key="x.img"
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
</template>
<style scoped>

.profile-header{
  border-bottom-right-radius: 1rem!important;
  border-bottom-left-radius: 1rem!important;
}
.btn-icon{
  width:100%;
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
import Ripple from 'vue-ripple-directive'
import VueSlickCarousel from 'vue-slick-carousel'
import BuyCard from './BuyCard.vue'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCarousel,
    BCarouselSlide,
    BCardTitle,
    BFormRating,
    BCardHeader,
    BCardText,
    BCardBody,
    BMedia,
    BImg,
    BButton,
    BuyCard,
    VueSlickCarousel,

  },
  directives: {
    Ripple,
  },
  data() {
    return {
      facilites: [
        {
          facilityName: 'Football',
          facilityType: '5 v 5',
          cost: '500',
          img: 'http://localhost:8080/images/sports/Football.png',
        },
        {
          facilityName: 'Basketball',
          facilityType: '3 v 3',
          cost: '1200',
          img: 'http://localhost:8080/images/sports/Basketball.png',
        },
        {
          facilityName: 'Badminton',
          facilityType: '2 v 2',
          cost: '350',
          img: 'http://localhost:8080/images/sports/Badminton.png',
        },
        {
          facilityName: 'Rugby',
          facilityType: '5 v 5',
          cost: '220',
          img: 'http://localhost:8080/images/sports/Rugby.png',
        },
      ],
      turf: {
        title: 'Ramagya Sport Academy',
        images: ['http://localhost:8080/images/turfs/turf1.jpeg', 'http://localhost:8080/images/turfs/turf2.jpg',
        ],
        desc: 'Located in the heart of Faridabad, Ramagya Spots Area has one of the best facilities when it comes to football turfs. All COVID-19 Safety norms are followed in this complex.',
        avgRating: 3.5,
        dis: 'Faridabad',
        state: 'Haryana',
        amenities: [1, 2, 4],
        sports: [
          {
            name: 'Badminton',
            img: 'http://localhost:8080/images/sports/Badminton.png',
          },
          {
            name: 'Football',
            img: 'http://localhost:8080/images/sports/Football.png',
          },
          {
            name: 'Rugby',
            img: 'http://localhost:8080/images/sports/Rugby.png',
          },
          {
            name: 'Basketball',
            img: 'http://localhost:8080/images/sports/Basketball.png',
          },

        ],
        toggleWishlist: true,
      },
      profileData: { },
      settings: {
        arrow: false,
        focusOnSelect: true,
        speed: 500,
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: true,
        touchMove: true,
      },
      amenities: [
        {
          img: 'http://localhost:8080/images/amenities/ac2.png',
          name: 'Full Airconditioned Courts',
        },
        {
          img: 'http://localhost:8080/images/amenities/cafe.png',
          name: 'Inhouse Cafe',
        },
        {
          img: 'http://localhost:8080/images/amenities/fl.png',
          name: 'Flood Lights',
        },
        {
          img: 'http://localhost:8080/images/amenities/dw.png',
          name: 'Clean and Safe drinking water',
        },
        {
          img: 'http://localhost:8080/images/amenities/cctv.png',
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
  created() {
    this.$http.get('/profile/data').then(res => { this.profileData = res.data })
  },
}
/* eslint-disable global-require */
</script>

<style lang="scss" >
@import '@core/scss/vue/pages/page-profile.scss';
</style>
