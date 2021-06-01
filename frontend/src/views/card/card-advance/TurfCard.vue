<template>

  <b-card
    text-variant="center"
    class="card card-congratulations"
    :style="{
      backgroundImage:`url('`+ cardImage +`')`
    }"
    style="height: 300px; width:100%;background-size: cover;"
  >
    <h1
      class="mb-1 mt-50 text-white card-title"
    >
      {{ cardTitle }}
    </h1>
    <b-card-text class="m-auto turf-cost">
      <strong>₹ {{ turfCost }}</strong>
    </b-card-text>
    <b-form-rating
      id="rating-lg"
      :value="rating"
      variant="warning"
      readonly
      size="lg"
      style="width: 42%; position: absolute; bottom: 2%; right: 2%; background-color: transparent; border: none;"
    />

  </b-card>
</template>

<style scoped>

.turf-cost{
  border: #ffffff 2px solid;
  position: absolute;
  border-radius: 500px;
  text-align: center;
  padding: 0px 10px 0px 10px;
  bottom: 2%;
}
.card-title{
  position: absolute;
  bottom: 10%;
  border-bottom: #fff 2px solid;

}
</style>
<script>
import {
  BCard, BCardText, BFormRating,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardText,
    BFormRating,

  },
  props: {
    cardTitle: String,
    cardImage: String,
    turfCost: String,
    rating: Number,
  },
}

</script>
