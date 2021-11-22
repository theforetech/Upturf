<template>
  <div>
    <b-card
      no-body
    >
      <b-card-header style="padding-left:0.5rem;padding-right: 0;">
        <b-row style="width: 100%;margin: 0;">
          <b-col
            cols="3"
            align-self="center"
          >
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
            </b-button>
          </b-col>
          <b-col
            cols="6"
            style="padding: 0"
          >
            <h2 style="text-align:center;font-size: 1rem;font-weight: 500;color:#000">
              Booking ID #{{ booking.orderID }}
            </h2>
            <h2 style="text-align:center;font-size: 0.8rem;font-weight: 500;color:#000">
              {{ booking.turf }}
            </h2>
          </b-col>
          <b-col
            cols="3"
            style="padding:0;position: absolute;right: 0;"
            align-self="center"
            align="center"
          >
            <b-button
              v-ripple.400="'rgba(52, 52, 55, 0.15)'"
              variant="flat-secondary"
              style="
                padding-left: 0.3rem;
                padding-right: 0.3rem;
                color:#202023;

             "
              href="tel:+91-9910583584"
            >
              <span class="align-middle">
                Help
              </span>
              <feather-icon
                icon="HelpCircleIcon"
                class="ml-50"
              />
            </b-button>
          </b-col>
        </b-row>
      </b-card-header>
    </b-card>
    <b-card class="summary">
      <b-card class="internal">
        <b-card-header style="padding :0px">
          <div style="width:100%;margin-bottom: 1rem;font-size: 1.1rem;font-weight: bold">
            Details:
          </div>
          <div class="checkout details">
            <h2>{{ booking.type }} - {{ booking.sport }} Turf</h2>
          </div>
          <div class="checkout details">
            <h2 style="font-size: 1rem!important;">
              Reservation Date: {{ formattedReservationDate }}
            </h2>
          </div>
          <div
            class="checkout details"
          >
            <h2 style="font-size: 0.9rem!important;">
              {{ booking.turf }}
            </h2>
          </div>
          <div class="checkout details">
            <h2 style="font-size: 0.9rem!important;">
              Slot(s) Reserved: {{ booking.slots.length }}
            </h2>
          </div>
          <div class="checkout details">
            <h2 style="font-size: 0.9rem!important;">
              Booking Date: {{ formattedBookingDate }}
            </h2>
          </div>

        </b-card-header>
        <b-card-body style="padding: 0rem;" />
      </b-card>
      <b-card class="internal">
        <b-card-header style="padding :0px">
          <div style="width:100%;margin-bottom: 1rem;font-size: 1rem;font-weight: bold">
            Order Summary:
          </div>
          <div class="checkout">
            <h2>Total Base Fare:</h2>
            <h2>₹ {{ booking.totalPrice }}</h2>
          </div>
          <div class="checkout">
            <h2>Convenience fee (5% Base Fare):</h2>
            <h2>₹ {{ booking.convFees }}</h2>
          </div>
          <div class="checkout">
            <h2>Coupon Discount:</h2>
            <h2 style="color: #2BB053">
              -₹ {{ booking.discount }}
            </h2>
          </div>
          <div class="checkout">
            <h2>Tax (GST Charges):</h2>
            <h2 style="color: #000">
              ₹ {{ booking.tax }}
            </h2>
          </div>
          <div
            id="totalP"
            class="checkout"
          >
            <h2>Total Pay (with tax)</h2>
            <h2>₹ {{ booking.finalAmt }}</h2>
          </div>
        </b-card-header>
        <b-card-body style="padding: 0rem;" />
      </b-card>
    </b-card>

    <b-card>
      <b-card-header style="padding :0px">
        <div style="margin-bottom: 1rem">
          Booked Slots ( {{ booking.slots.length }} )
        </div>
      </b-card-header>
      <b-card-body style="padding: 0rem;">
        <summary-card
          v-for="x in booking.slots"
          :key="x.id"
          :time-slot="x.time"
          :sport="booking.sport"
          :date="formattedReservationDate"
          :cost="x.price"
          class="summaryCard"
        />
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          block
          variant="dark"
        >
          Download Invoice
          <feather-icon
            icon="DownloadIcon"
          />
        </b-button>
      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BButton,
  BCardBody,
  BRow, BCol,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import moment from 'moment'
import SummaryCard from './SummaryCard.vue'

export default {
  components: {
    BCard,
    BButton,
    BCardHeader,
    BCardBody,
    SummaryCard,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      booking: {
        totalPrice: 0,
        convFees: 0,
        discount: 0,
        tax: 0,
        finalAmt: 0,
        sport: 'Football',
        dob: '2021 10 20',
        bookingDate: '2021 10 27',
        slots: [
          {
            id: '4',
            available: true,
            price: '1000',
            time: '6:00PM',
          },
          {
            id: '5',
            available: true,
            price: '1000',
            time: '7:00PM',
          },
          {
            id: '6',
            available: true,
            price: '1700',
            time: '10:00PM',
          },
        ],
        type: '5 v 5',
        orderID: 'UPT00012',
        turf: 'Sirifort Stadium',
      },
    }
  },
  computed: {
    formattedReservationDate() {
      return moment(this.booking.bookingDate).format('Do MMM YYYY')
    },
    formattedBookingDate() {
      return moment(this.booking.dob).format('Do MMM YYYY')
    },
  },

  methods: {
    navigateBack() {
      this.$router.go(-1)
    },
    moment() {
      return moment
    },
  },
}
/* eslint-disable global-require */
</script>
<style scoped>
h2{
  font-size: 0.8rem;
}
.back{
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
  font-size: 1.3rem;
  font-weight: bolder;
  padding-left:0.6rem ;
  padding-right:0rem ;
}
.checkout{
  width: 100%;
  line-height: 1.8;
}
.checkout h2:nth-child(1){
  float: left;
}
.checkout h2:nth-child(2){
  position:absolute;
  right:0;
}
.details h2{
  line-height: 1.4;
  font-size: 1.1rem;

}
#totalP{
  border-top: 2px solid rgba(69, 69, 69,0.8);
  padding-top: 0.8rem;
  margin-top: 0.8rem;
}
#totalP h2{
  font-weight: 600;
  font-size: 1.04rem;
}
.internal .card-body{
  padding-top: 0;
  padding-bottom: 0;
}
.summary .card-body{
  padding-bottom: 0;
}
.summaryCard{
  margin-bottom: 1rem;
}

</style>
<style lang="scss" >
@import '@core/scss/vue/pages/page-profile.scss';
</style>
