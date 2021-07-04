<template>
  <b-card
    :img-src="sportImage"
    img-top-card-images-vue
    img-alt="card img"
    class="mb-3 sportCard radial-gradient"
    title-tag="h1"
    style="border-radius:1rem;"
  >
    <template
      #footer
      class="sport-title"
    >
      {{ sportTitle }}
    </template>
  </b-card>

</template>

<style scoped>
.sportCard>.card-img{
  /*border-radius: 50%;*/
  aspect-ratio: 1 / 1;
  padding:1rem 0.5rem 0rem 0.5rem;
}
.card-footer{
  font-size: 2.0rem;
  text-align: center;
  margin-bottom: 0px!important;
  width: 100%;
  padding-bottom:0.8rem;
  padding-top:0.8rem;
  background: #fff;
  border-bottom-right-radius:1rem;
  border-bottom-left-radius:1rem;
}
.radial-gradient {
  /*Fallback if gradeints don't work /
  background: #9b59b6;
  /Linear gradient... */
  background:
      radial-gradient(
          at center, #A5DBD8,#A5DBD8
      );
}
.card-body{
  padding:0;
}
@media screen and (max-width: 1200px) {
  .card-footer{
    font-size: 1.8rem;
  }
}
@media screen and (max-width: 768px) {
  .card-footer{
    font-size: 1.6rem;
  }
}
@media screen and (max-width: 576px) {
  .card-footer{
    font-size: 1.4rem;
  }
}
@media screen and (max-width: 370px) {
  .card-footer{
    font-size: 1.0rem;
  }
}
</style>
<script>
import {
  BCard,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
  },
  props: {
    sportTitle: {
      type: String,
      default: '',
    },
    sportImage: {
      type: String,
      default: '',
    },
  },
}

</script>
