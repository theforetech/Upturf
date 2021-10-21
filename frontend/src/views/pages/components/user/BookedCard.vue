<template>
  <b-card
    class="user-booking"
  >
    <b-container style="padding: 0">
      <b-row
        style="padding-bottom: 1.5rem"
      >
        <b-col>
          <b-img
            :src="url"
            class="sport-image"
          />
        </b-col>
        <b-col>
          <h2 style="font-size: 1rem;color:#202023">
            {{ facility }}
          </h2>
          <h2 style="font-size: 0.8rem;color:#3D3D42;overflow-wrap: break-word;">
            {{ turf }}
          </h2>
          <h2 style="font-size: 0.8rem;color:#3D3D42;">
            {{ dateFormat }}
          </h2>
        </b-col>
        <b-col style="position: absolute;right: 3%;">
          <b-badge :variant="statusCheck.color">
            {{ statusCheck.name }}
          </b-badge>
          <h2 style="font-size: 1rem;color:#202023;padding-top: 0.6rem">
            ₹ {{ amount }}
          </h2>
          <h2 style="font-size: 0.8rem;color:#3D3D42">
            Slots: {{ slots }}
          </h2>
        </b-col>
      </b-row>
    </b-container>

    <b-row align-h="center">

      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="flat-secondary"
        class="booking-btn"
        style="color:#202023;"
      >
        View Summary
      </b-button>
      <div style="border-left: 1px solid rgba(32, 32, 35,0.4)" />
      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="flat-danger"
        class="booking-btn"
        :class="{display:buttonUpdate}"
      >
        Cancel Booking
      </b-button>

    </b-row>

  </b-card>
</template>

<script>
import {
  BCard, BButton, BImg, BRow, BBadge, BContainer,
  // , BCardText, BLink
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import moment from 'moment'

export default {
  components: {
    BCard,
    // BCardText,
    // BLink,
    BImg,
    BButton,
    BRow,
    BContainer,
    BBadge,
  },
  directives: {
    Ripple,
  },
  props: {
    turf: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    slots: {
      type: Number,
      required: true,
    },
    sport: {
      type: String,
      required: true,
    },
    facility: {
      type: Number,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sportImg: [
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
      status: [
        {
          name: 'Upcoming',
          color: 'success',
        },
        {
          name: 'Concluded',
          color: 'secondary',
        },
        {
          name: 'Cancelled',
          color: 'danger',
        },
      ],
    }
  },
  computed: {
    url() {
      const x = this.sportImg.filter(elem => elem.name === this.sport)
      return x[0].img
    },
    statusCheck() {
      const y = this.status.filter(elem => elem.name === this.tag)
      return y[0]
    },
    buttonUpdate() {
      return this.statusCheck.name !== 'Upcoming'
    },
    dateFormat() {
      const formattedDate = moment(this.date).format('Do MMM YYYY')
      return formattedDate
    },

  },
}
</script>
<style scoped>
.booking-btn {
  white-space: nowrap;
  font-size: 0.9rem;
  margin: auto;
  padding: 0.8rem 0.6rem;

}
.sport-image{
  height: 3rem;
}

.user-booking .card-body{
  padding-bottom: 0.5rem!important;
}
.display {
  display:none;
}

</style>
