<template>
  <div style="overflow: hidden;">
    <b-card
      no-body
      style="margin-bottom: 0.6rem"
    >
      <b-card-header>
        <b-button
          v-ripple.200="'rgba(135, 135, 149 ,0.3)'"
          class="back"
          @click="navigateBack"
        >
          <feather-icon
            icon="ChevronLeftIcon"
            size="27"
            style="color: #1e1e1e;"
          />
        </b-button> <span style="color:#202023;margin: auto;font-size: 1.3rem;font-weight: 500">Your Bookings</span>
      </b-card-header>
    </b-card>
    <!--    <BookedCard-->
    <!--      v-for="x in bookingsOld"-->
    <!--      :key="x.id"-->
    <!--      :turf="x.turf"-->
    <!--      :slots="x.slots"-->
    <!--      :amount="x.amount"-->
    <!--      :facility="x.facility"-->
    <!--      :sport="x.sport"-->
    <!--      :tag="x.tag"-->
    <!--      :date="x.date"-->
    <!--    />-->
    <template
      v-if="bookings.length > 0"
    >
      <BookedCard
        v-for="x in bookings"
        :key="x.id"
        :booking-id="x.id"
        :turf="x.facility.turf.name"
        :slots="x.booked_slots_aggregate.aggregate.count"
        :amount="x.amount"
        :facility="x.facility.type"
        :sport="x.facility.sport.name"
        :tag="getTag(x.booking_status, x.payment_status, x.reservation_date, x.booked_slots[0].startTime)"
        :date="x.reservation_date"
      />
    </template>
    <div v-else>
      <b-alert
        class="m-2"
        variant="warning"
        show
      >
        <h4 class="alert-heading">
          Oops
        </h4>
        <div class="alert-body">
          <span>No bookings found. Explore Turfs and create some! :)</span>
        </div>
      </b-alert>
    </div>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BButton,
  BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
import moment from 'moment'
import BookedCard from './BookedCard.vue'

export default {
  components: {
    BAlert,
    BCard,
    BButton,
    BCardHeader,
    BookedCard,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      bookings: [],
      bookingsOld: [
        {
          id: '0',
          turf: 'Sirifort Stadium',
          sport: 'Football',
          facility: '3 v 3',
          slots: 3,
          amount: '3000',
          tag: 'Processing',
          date: '2021 10 28',

        },
        {
          id: '1',
          turf: 'Manav Rachna Sport Academy',
          sport: 'Football',
          facility: '3 v 3',
          slots: 3,
          amount: '3000',
          tag: 'Upcoming',
          date: '2021 10 28',
        },
        {
          id: '2',
          turf: 'Panchsheel Club',
          sport: 'Badminton',
          facility: '1 v 1',
          slots: 2,
          amount: '2000',
          tag: 'Concluded',
          date: '2021 09 22',
        },
        {
          id: '3',
          turf: 'Panchsheel Club',
          sport: 'Basketball',
          facility: '5 v 5',
          slots: 1,
          amount: '5000',
          tag: 'Cancelled',
          date: '2021 08 12',
        },
        {
          id: '4',
          turf: 'Panchsheel Club',
          sport: 'Basketball',
          facility: '5 v 5',
          slots: 1,
          amount: '5000',
          tag: 'Refunded',
          date: '2021 08 12',
        },
      ],
    }
  },
  mounted() {
    this.getBookings()
  },
  methods: {
    getTag(booking, payment, date, startTime) {
      if (booking === 1 && payment === 'success') {
        const now = moment()
        const then = moment(`${date} ${startTime.slice(0, -3)}`)
        if (then.isBefore(now)) {
          return 'Concluded'
        }
        return 'Upcoming'
      } if (booking === 0 && payment === 'processing') {
        return 'Processing'
      } if (booking === 2 && payment === 'refund_initiated') {
        return 'Refund Initiated'
      } if (booking === 2 && payment === 'refunded') {
        return 'Refunded'
      }
      if (booking === 2) {
        return 'Cancelled'
      }
      return 'Processing'
    },
    async getBookings() {
      const result = await this.$apollo.query({
        query: gql`query {
          bookings(order_by: {reservation_date: desc}) {
            id
            amount
            payment_status
            booking_status
            split_payment
            split_members
            split_amount
            reservation_date
            facility {
              id
              sport {
                id
                name
              }
              type
              price
              turf {
                id
                name
              }
            }
            booked_slots_aggregate {
              aggregate {
                count(columns: slot_id)
              }
            }
            booked_slots(order_by: {startTime: asc}, limit: 1) {
              startTime
            }
          }
        }`,
      })
      this.bookings = result.data.bookings
    },
    navigateBack() {
      // this.$router.go(-1)
      this.$router.push({
        name: 'home',
      })
    },
  },
}
/* eslint-disable global-require */
</script>
<style scoped>
.back{
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
  font-size: 1.3rem;
  font-weight: bolder;
  padding-left:0.6rem ;
}

</style>
<style lang="scss" >
@import '@core/scss/vue/pages/page-profile.scss';
</style>
