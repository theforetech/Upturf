<template>
  <b-card
    class="user-booking"
  >
    <b-container style="padding: 0">
      <b-row
        style="padding-bottom: 1.5rem"
      >
        <b-col
          style="padding-left: 0;padding-right: 3rem"
          cols="1"
          align-h="start"
        >
          <b-img
            :src="url"
            class="sport-image"
          />
        </b-col>
        <b-col
          cols="6"
          align-h="center"
          style="padding-left: 0.2rem;"
        >
          <div>
            <h2 style="font-size: 1rem;color:#202023">
              {{ facility }}
            </h2>
            <h2 style="font-size: 0.8rem;color:#3D3D42;overflow-wrap: break-word;">
              {{ turf }}
            </h2>
            <h2 style="font-size: 0.72rem;color:#3D3D42;">
              Booking Date: {{ dateFormat }}
            </h2>
          </div>

        </b-col>
        <b-col
          align-h="end"
        >
          <b-badge :variant="statusCheck.color">
            {{ statusCheck.name !== 'Refund Initiated' ? statusCheck.name : 'Cancelled' }}
          </b-badge>
          <h2 style="font-size: 1rem;color:#202023;padding-top: 0.6rem">
            ₹ {{ amount }}
          </h2>
          <h2 style="font-size: 0.72rem;color:#3D3D42">
            Slots: {{ slots }}
          </h2>
        </b-col>
      </b-row>
    </b-container>

    <b-row align-h="center">
      <b-button
        v-if="statusCheck.name === 'Refund Initiated'"
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        :disabled="true"
        variant="flat-secondary"
        class="booking-btn"
        style="color:#202023;"
      >
        Refund Initiated
      </b-button>

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
    <b-row
      align-h="center"
      style="margin-top: 1rem"
      :class="{display:statusCheck.name!=='Processing'}"
    >

      <b-button
        v-ripple.400="'rgba(255, 255, 255, 0.15)'"
        variant="flat-success"
        class="booking-btn"
      >
        Complete Payment
      </b-button>

    </b-row>

  </b-card>
</template>

<script>
import {
  BCard, BButton, BImg, BRow, BBadge, BContainer, BCol,
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
    BCol,
  },
  directives: {
    Ripple,
  },
  props: {
    turf: {
      type: [String, Number],
      required: true,
      default: '',
    },
    amount: {
      type: [String, Number],
      required: true,
      default: '',
    },
    slots: {
      type: [String, Number],
      required: true,
      default: 0,
    },
    sport: {
      type: [String, Number],
      required: true,
      default: '',
    },
    facility: {
      type: [String, Number],
      required: true,
      default: '',
    },
    tag: {
      type: [String, Number],
      required: true,
      default: '',
    },
    date: {
      type: [String, Number],
      required: true,
      default: '',
    },
  },
  data() {
    return {
      sportImg: [
        {
          name: 'badminton',
          img: '/images/sports/Badminton.png',
        },
        {
          name: 'football',
          img: '/images/sports/Football.png',
        },
        {
          name: 'rugby',
          img: '/images/sports/Rugby.png',
        },
        {
          name: 'basketball',
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
          color: 'dark',
        },
        {
          name: 'Cancelled',
          color: 'danger',
        },
        {
          name: 'Refunded',
          color: 'secondary',
        },
        {
          name: 'Refund Initiated',
          color: 'secondary',
        },
        {
          name: 'Processing',
          color: 'info',
        },
      ],
    }
  },
  computed: {
    url() {
      const x = this.sportImg.filter(elem => elem.name === this.sport.toLowerCase())
      return x[0].img
    },
    statusCheck() {
      const y = this.status.filter(elem => elem.name === this.tag)
      return y[0]
    },
    buttonUpdate() {
      if (this.statusCheck.name === 'Processing' || this.statusCheck.name === 'Upcoming') {
        return false
      }
      // if (this.statusCheck.name !== 'Upcoming') {
      //   console.log(this.statusCheck.name)
      //   return true
      // }

      return true
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
.user-booking{
  margin: 0rem 0!important;
  border-bottom: 1px solid rgba(32, 32, 35,0.3);
}
</style>
