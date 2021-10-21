<template>
  <b-card
    class="card-congratulation-medal"
    style="background-color:#f2f2f2 ;!important; width: 97%;border: 1px solid rgba(28, 28, 28, 0.5);"
  >
    <h1 style="color: #363636;">
      {{ facilityName }}
    </h1>
    <b-card-text
      class="font-large-1"
      style="color: #363636;"
    >
      {{ facilityType }}
    </b-card-text>
    <h3 class="mb-75 mt-4">
      <b-link>₹ {{ cost }}</b-link>
    </h3>
    <b-button
      v-ripple.400="'rgba(255, 255, 255, 0.15)'"
      variant="primary"
      @click="book"
    >
      BOOK
    </b-button>
    <b-img
      :src="sport"
      class="congratulation-medal"
      alt="Medal Pic"
      width="215"
      style="margin-top: 60px;!important;right:-30px;"
    />
  </b-card>
</template>

<script>
import {
  BCard, BCardText, BLink, BButton, BImg,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    BCardText,
    BLink,
    BImg,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    facilityID: {
      type: Number,
      default: null,
    },
    turfID: {
      type: Number,
      default: null,
    },
    facilityName: {
      type: String,
      default: '',
    },
    sport: {
      type: String,
      default: '',
    },
    cost: {
      type: Number,
      default: 9999,
    },
    weekendCost: {
      type: Number,
      default: 9999,
    },
    facilityType: {
      type: String,
      default: '',
    },
  },
  methods: {
    book() {
      this.$router.push({
        name: 'booking',
        params: {
          facility: this.facilityID,
          turf: this.turfID,
        },
      })
    },
  },
}
</script>
