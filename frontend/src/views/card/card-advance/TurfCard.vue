<template>

  <b-card
    style="padding: 0"
    class="turf-card"
  >
    <b-carousel
      id="carousel-crossfade"
      indicators
      fade
    >
      <b-carousel-slide
        v-for="y in cardImage"
        :key="y"
        class="carousal-image"
        :img-src="y"
      />
    </b-carousel>
    <template #footer>
      <h1 class="turf-title">
        {{ cardTitle }}
      </h1>
      <b-badge
        variant="success"
        class="badge"
      >
        <span>{{ rating }}</span>  <feather-icon
          icon="StarIcon"
          class="star-icon"
        /><i class="fas fa-star" />
      </b-badge></template>
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
  BCard, BCardText, BCarousel, BCarouselSlide, BBadge,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
    BCarousel,
    BCarouselSlide,
    BBadge,

  },
  props: {
    cardTitle: {
      type: String,
      default: '',
    },
    cardImage: {
      type: Array,
      default: () => [{}],
    },
    turfCost: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
}

</script>
<style scoped>
@import url('http://fonts.cdnfonts.com/css/airbnb-cereal-app');
.turf-card>.card-body{
  padding: 0;
  border-radius: 1.5rem;
}
.turf-card{
  border-radius: 1.5rem;
  background: rgba(0,0,0,0);
}
.turf-card>.card-footer{
  border-top: 0px;

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
  padding-top: 1px;
}
</style>
<style>
.carousal-image>img{
  border-radius: 1.5rem ;
}
</style>
