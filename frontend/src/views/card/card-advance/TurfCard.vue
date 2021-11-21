<template>

  <b-card
    style="padding: 0"
    class="turf-card pointerCursor"
    no-body
    @click="navigateTo"
  >
    <b-carousel
      id="carousel-crossfade"
      indicators
      fade
      style="transform: scale(1.025);"
    >
      <div style="position:absolute;z-index: 2;width: 100%;margin-top: 15px; ">
        <b-button
          v-ripple.400="'rgba(0, 0, 0, 0.15)'"
          variant="gradient-secondary"
          class="btn-wishlist"
          style="float: right;aspect-ratio:1/1;border-radius:50%;padding:0.5rem;background-image: linear-gradient(47deg, #fff, #f8f8f8)!important;margin-right:1rem;box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );"
        >
          <feather-icon
            icon="HeartIcon"
            size="18"
            class="text-danger"
          />
        </b-button>
      </div>
      <b-carousel-slide
        v-for="y in cardImage"
        :key="cardId+y.url"
        class="carousal-image"
        :img-src="y.url"
      />
    </b-carousel>
    <template #footer>
      <div
        style="background-color: #3b4253!important; cursor: pointer;"
        @click="navigateTo"
      >
        <h1
          class="turf-title w-75 pointerCursor"
          @click="navigateTo"
        >
          {{ cardTitle }}
        </h1>
        <b-badge
          :variant="rating ? 'success' : 'info'"
          class="badge pointerCursor"
          @click="navigateTo"
        >
          <span>{{ rating ? rating : '-' }}</span>  <feather-icon
            icon="StarIcon"
            class="star-icon"
          />
          <!--          /><i class="fas fa-star" />-->
        </b-badge>
      </div>
      <div
        class="pointerCursor"
        style="background-color: #3b4253!important; margin-top: 2.5rem;"
        @click="navigateTo"
      >
        <h1
          class="turf-title w-25 pointerCursor"
          style="float: right; text-align: right;"
          @click="navigateTo"
        >
          <span
            v-for="x in turfAvgCost"
            :key="x"
            class="pointerCursor"
            @click="navigateTo"
          >₹</span>
        </h1>
        <div
          style="float: left;"
          class="w-75 pointerCursor"
          @click="navigateTo"
        >
          <feather-icon
            icon="MapPinIcon"
            class="star-icon pointerCursor"
            @click="navigateTo"
          />
          &nbsp;
          <span
            class="pointerCursor"
            @click="navigateTo"
          >{{ street }}</span>
        </div>
      </div>
      <div
        style="padding-top: 2.5rem !important;"
        class="pointerCursor"
        @click="navigateTo"
      >
        <b-row
          align-h="center"
          class="pointerCursor"
          @click="navigateTo"
        >
          <b-col
            v-for="x in sports"
            :key="x.id"
            class="pointerCursor"
            cols="1"
            style="padding: 0px"
            @click="navigateTo"
          >
            <b-img
              :src="x.image"
              alt="browser img"
              class="mr-1 pointerCursor"
              width="23"
              @click="navigateTo"
            />
          </b-col>
        </b-row>
      </div>
    </template>
    <b-card-text />
  </b-card>
</template>

<style scoped>

/*.turf-cost{*/
/*  border: #ffffff 2px solid;*/
/*  position: absolute;*/
/*  border-top-left-radius: 500px;*/
/*  border-top-right-radius: 500px;*/
/*  text-align: center;*/
/*  padding: 0px 10px 0px 10px;*/
/*  bottom: 2%;*/
/*}*/
/*.card-title{*/
/*  position: absolute;*/
/*  bottom: 10%;*/
/*  border-bottom: #fff 2px solid;*/

/*}*/
</style>
<script>
import {
  BCard, BCardText, BCarousel, BCarouselSlide, BBadge, BImg, BRow, BCol, BButton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    BCardText,
    BCarousel,
    BCarouselSlide,
    BBadge,
    BImg,
    BRow,
    BCol,
    BButton,

  },
  directives: {
    Ripple,
  },
  props: {
    cardId: {
      type: Number,
      default: 1,
    },
    cardTitle: {
      type: String,
      default: '',
    },
    cardImage: {
      type: Array,
      default: () => [],
    },
    turfAvgCost: {
      type: Number,
      default: 1,
    },
    rating: {
      type: Number,
      default: 0,
    },
    street: {
      type: String,
      default: '',
    },
    sports: {
      type: Array,
      default: () => [{}],
    },
  },
  data() {
    return {
      wishlist: false,
    }
  },
  methods: {
    toggleWishlist() {
      this.wishlist = !this.wishlist
    },
    navigateTo() {
      this.$router.push({ name: 'pages-turf', params: { id: this.cardId } })
    },
  },
}

</script>
<style scoped>
@import url('https://fonts.cdnfonts.com/css/airbnb-cereal-app');
.turf-card>.card-body{
  padding: 0;
  border-radius: 1.5rem;
  background-color: transparent;
}
.turf-card{
  border-radius: 1.5rem;
  /*background: rgba(0,0,0,0);*/
  /*background-color: #000;*/
}
.turf-card>.card-footer{
  border-top: 0px;
  /*background-color: transparent;*/
  padding-left: 10px;
  padding-right: 20px;
  padding-bottom: 10px;
}
.turf-title {
  font-size: 1.1rem;
  font-weight: bold;
  float: left;
  color: #000;
}
.badge{
  float:right;
  padding:6px 7px;
}
.badge>span{
  padding-top: 10px;
  size: 10px;
}
</style>
<style>
.carousal-image>img{
  border-radius: 1.5rem ;
  height: 18rem!important;
}
.pointerCursor {
  cursor: pointer;
}
</style>
