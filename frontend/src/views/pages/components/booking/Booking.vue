<template>

  <div>
    <div v-if="showSummary===1">
      <b-card
        no-body
      >
        <b-card-header>
          <b-button
            v-ripple.200="'rgba(135, 135, 149 ,0.3)'"
            class="back"
            @click="summary"
          >
            <feather-icon
              icon="ChevronLeftIcon"
              size="27"
              style="color: #1e1e1e;"
            />
          </b-button> <span style="margin: auto;font-size: 1.2rem;font-weight: 500">{{ turf.name }}</span>
        </b-card-header>
      </b-card>
      <b-card>
        <b-card-header style="padding :0px">
          <div style="margin-bottom: 1rem">
            Slots Selected ( {{ slotsSelected }} )
          </div>
        </b-card-header>
        <b-card-body style="padding: 0rem;">
          <slot-card
            v-for="x in selectedSlots"
            :key="x"
            icon="XIcon"
            :statistic="x.time"
            :statistic-title="x.price"
            :date="checkoutDate"
            class="slotCard"
          />
        </b-card-body>
      </b-card>
      <b-card>
        <b-card-header style="padding :0px">
          <div style="width:100%;margin-bottom: 1rem;font-size: 1.1rem;font-weight: bold">
            Order Summary:
          </div>
          <div class="checkout">
            <span>Total Base Fare:</span>
            <span>₹ {{ totalPrice }}</span>
          </div>
          <div class="checkout">
            <span>Convenience fee (5% Base Fare):</span>
            <span>₹ {{ convFees }}</span>
          </div>
          <div class="checkout">
            <span>Coupon Discount:</span>
            <span style="color: #2BB053">-₹ {{ discount }}</span>
          </div>
          <div
            id="totalP"
            class="checkout"
          >
            <span>Total Pay (without tax)</span>
            <span>₹ {{ checkoutAmt }}</span>
          </div>
        </b-card-header>
        <b-card-body style="padding: 0rem;" />
      </b-card>
      <div class="booking-bar">
        <span>Slot(s) : {{ slotsSelected }} • &nbsp; ₹ {{ checkoutAmt }} Plus Tax </span>
        <b-button
          v-ripple.400="'rgba(40, 199, 111, 0.3)'"
          :disabled="!canCheckout"
          @click="checkout"
        >
          Checkout →
        </b-button>
      </div>
    </div>
    <div v-else-if="showSummary===0">
      <b-card
        no-body
      >
        <b-card-header>
          <b-button
            v-ripple.200="'rgba(135, 135, 149 ,0.3)'"
            class="back"
            @click="goBack"
          >
            <feather-icon
              icon="ChevronLeftIcon"
              size="27"
              style="color: #1e1e1e;"
            />
          </b-button> <span style="margin: auto;font-size: 1.2rem;font-weight: 500">{{ turf.name }}</span>
        </b-card-header>
      </b-card>
      <b-card>
        <b-card-header style="padding-top:0;">
          <span style="font-size: 1.2rem;font-weight: 500">
            Select your date.
          </span>

        </b-card-header>
        <b-card-body
          class="date"
        >
          <VueSlickCarousel
            ref="carousel"
            v-bind="settings"
          >
            <div
              v-for="(x,i) in daysOfWeek"
              :key="x"
            >
              <b-button
                class="date-btn"
                :value="moment().add(i,'d').format('YYYY-MM-DD')"
                @click="getDate($event)"
              >
                {{ moment().add(i,'d').format('ddd') }} <br>
                {{ moment().add(i,'d').format('MMM Do') }}
              </b-button></div>
          </VueSlickCarousel>
        </b-card-body>
      </b-card>
      <b-card>
        <b-card-header style="padding-top:0;" />
        <b-card-body style="padding: 0 0.5rem">
          <b-table
            ref="selectableTable"
            class="slotTable"
            selectable
            select-mode="multi"
            :items="selectedDate[0].slots"
            :fields="fields"
            responsive="lg"
            borderless
            @row-selected="onRowSelected"
          >
            <!-- Example scoped slot for select state illustrative purposes -->
            <template
              #cell(*)="{ rowSelected }"
            >
              <template v-if="rowSelected">
                <i
                  class="feather icon-check-circle primary"
                  style="color: #3FB27F"
                />
              </template>

              <template v-else>
                <i
                  class="feather icon-x-circle primary"
                  style="color: #fff"
                />
              </template>
            </template>

            <template #cell(avatar)="data">
              <b-avatar :src="data.value" />
            </template>
            <template #cell(time)="data">
              {{ data.value }}
            </template>
            <template #cell(price)="data">
              ₹ {{ data.value }}
            </template>
            <template #cell(status)="data">
              <b-badge :variant="status[1][data.value]">
                {{ status[0][data.value] }}
              </b-badge>
            </template>
          </b-table>

        </b-card-body>
      </b-card>
      <div class="booking-bar">
        <span>Slot(s) : {{ slotsSelected }} • &nbsp; ₹ {{ totalPrice }} Plus Charges </span>
        <b-button
          v-ripple.400="'rgba(40, 199, 111, 0.3)'"
          :disabled="!canCheckout"
          @click="summary()"
        >
          Summary →
        </b-button>
      </div>
    </div>
    <div v-else-if="showSummary===2">
      <b-row
        class="vh-100 text-center"
        align-h="center"
        align-v="center"
      ><b-col />
        <b-col
          cols="10"
        >
          <b-img
            src="http://localhost:8080/images/loading/loading2.gif"
            fluid-growth
            style="height: 20rem;margin:auto"
          />
          <h2 style="margin-left: 1rem">
            Getting your turf. . .
          </h2>
        </b-col>
        <b-col />
      </b-row>
    </div>
  </div>

</template>

<script>
import {
  BCardHeader, BCardBody, BCard, BButton, BTable, BImg, BRow, BCol,
} from 'bootstrap-vue'

import VueSlickCarousel from 'vue-slick-carousel'
// import { Carousel3d, Slide } from 'vue-carousel-3d'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import moment from 'moment'
import gql from 'graphql-tag'
import Ripple from 'vue-ripple-directive'
import SlotCard from './SlotCard.vue'

export default {
  components: {
    BCardHeader,
    BCardBody,
    BCard,
    BButton,
    VueSlickCarousel,
    BTable,
    SlotCard,
    BImg,
    BRow,
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      fields: [{
        key: '*', label: '*', trClass: 'slotRows', tdClass: 'slotData',
      },
      {
        key: 'time', label: 'Slots', trClass: 'slotRows', tdClass: 'slotData',
      },
      {
        key: 'price', label: 'Price', trClass: 'slotRows', tdClass: 'slotData',
      },
      ],
      date: moment().format('YYYY-MM-DD'),
      turf: {
        name: 'Sirifort Sport Complex',
      },
      slotts: [],
      selectedSlots: [],
      selectedDate: [{
        date: '2021-10-17',
        slots: [
          {
            available: true,
            price: '1000',
            time: '6:00PM',
          },
          {
            available: true,
            price: '1000',
            time: '7:00PM',
          },
          {
            available: true,
            price: '1000',
            time: '8:00PM',
          },
          {
            available: true,
            price: '1400',
            time: '9:00PM',
          },
        ],
      }],
      dates: [
        {
          date: '2021-10-18',
          slots: [
            {
              available: true,
              price: '1000',
              time: '6:00PM',
            },
            {
              available: true,
              price: '1000',
              time: '7:00PM',
            },
            {
              available: true,
              price: '1000',
              time: '8:00PM',
            },
            {
              available: true,
              price: '1400',
              time: '9:00PM',
            },
          ],
        },
        {
          date: '2021-10-19',
          slots: [
            {
              available: true,
              price: '1000',
              time: '6:00PM',
            },
            {
              available: true,
              price: '1000',
              time: '7:00PM',
            },
            {
              available: true,
              price: '1700',
              time: '10:00PM',
            },
          ],
        },
      ],

      settings: {
        arrows: false,
        focusOnSelect: true,
        speed: 500,
        infinite: false,
        slidesToShow: 3.5,
        slidesToScroll: 3,
        draggable: true,
        touchMove: true,
      },
      daysOfWeek: 7,
      slotsSelected: 0,
      tempPrice: 0,
      totalPrice: 0,
      showSummary: 0,
      canCheckout: false,
      checkoutDate: moment().format('DD MMM YYYY'),
      convFees: 0,
      discount: 0,
      checkoutAmt: 0,
    }
  },
  mounted() {

  },
  methods: {
    moment() {
      return moment()
    },
    getDate(e) {
      this.checkoutDate = moment(e.target.value).format('DD MMM YYYY')
      this.selectedDate = this.dates.filter(x => x.date.includes(e.target.value.toString()))
    },
    // getSlot(e, i) {
    //   // console.log(e.target.value)
    //   console.log(this.selectedSlots.time)
    //   if (this.selectedSlots.includes(e.target.value)) {
    //     this.selectedSlots.splice(i - 1, 1)
    //   } else {
    //     this.selectedSlots.push(e.target.value)
    //   }
    // },
    onRowSelected(item) {
      this.selectedSlots.push(item)
      console.log(this.selectedSlots)
      this.slotsSelected = this.selectedSlots.length
      for (let i = 0; i < this.selectedSlots.length; i += 1) {
        this.tempPrice += parseInt(this.selectedSlots[i].price, 10)
      }
      this.totalPrice = this.tempPrice
      this.tempPrice = 0
      this.canCheckout = this.slotsSelected > 0
    },
    onRowUnSelected(item) {
      this.selectedSlots = this.selectedSlots.filter(slot => slot.id !== item.id)
      console.log(this.selectedSlots)
      this.slotsSelected = this.selectedSlots.length
      for (let i = 0; i < this.selectedSlots.length; i += 1) {
        this.tempPrice += parseInt(this.selectedSlots[i].price, 10)
      }
      this.totalPrice = this.tempPrice
      this.tempPrice = 0
      this.canCheckout = this.slotsSelected > 0
    },
    isRowSelected(item) {
      // eslint-disable-next-line no-restricted-syntax
      for (const slot of this.selectedSlots) {
        if (slot.id === item.id) {
          return true
        }
      }
      return false
    },
    async getSlots() {
      console.log('hello')
      const result = await this.$apollo.query({
        query: gql`query {
            slots(where: {facility_id: {_eq: 10}}) {
                start_time
            }
        }`,
      })
      this.slotts = result.data.slots.map(slots => ({
        start_time: slots.start_time,
      }))
      console.log(this.slotts)
    },
    goBack() {
      this.$router.go(-1)
    },
    summary() {
      if (this.showSummary === 1) {
        this.showSummary = 0
        this.slotsSelected = 0
        this.selectedSlots = []
        this.totalPrice = 0
        this.canCheckout = false
      } else if (this.selectedSlots.length > 0) {
        this.showSummary = 1
        this.convFees = this.totalPrice * 0.05
        this.discount = this.totalPrice * 0.2
        this.checkoutAmt = this.totalPrice + this.convFees - this.discount
      }
    },
    checkout() {
      this.showSummary = 2
    },
  },
}
</script>
<style scoped>
.date{
  padding: 0px 0px;
}
.date-btn{
  background: transparent!important;
  color: #1e1e1e!important;
  font-weight: 400;
  margin: 0.2rem;
  padding-right: 0.6rem;
  padding-left: 0.6rem;
  font-size: 1rem;
  line-height: 1.2;
}
.active {
   background-color: #1e1e1e!important;
   color:#fff!important;
}
.slot-btn {
  width: 100%;
  background: none;
  border: #1e1e1e 1px solid;
  padding: 0.7rem;
  margin-bottom: 0.8rem;
  border-radius: 5px;
}
/deep/ .slotTable thead
{
  display: none;
}
/deep/ .slotData{
  color: #1ab7ea;
  line-height: 2;
}
/deep/ .slotTable{
  background-color: #f4731c;
}
.booking-bar{
  color:#fff;
  height: 4rem;
  width: 100%;
  background-color: #2BB053;
  position: fixed;
  bottom: 0rem;
}
.booking-bar span{
  position:absolute;
  top:30%;
  left:3%;
  font-size:0.9rem;
  font-weight: 500;
}
.booking-bar button{
  float:right;
  margin-top: 0.7rem;
  font-size: 0.9rem;
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
}
.back{
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
  font-size: 1.3rem;
  font-weight: bolder;
  padding-left:0.6rem ;
}
.slotCard{
  margin-bottom: 0.6rem;
}
.checkout{
  width: 100%;
  line-height: 1.8;
}
.checkout span:nth-child(1){
  float: left;
}
.checkout span:nth-child(2){
  position:absolute;
  right:0;
}
#totalP{
  border-top: 2px solid rgba(69, 69, 69,0.8);
  padding-top: 0.8rem;
  margin-top: 0.8rem;
}
#totalP span{
  font-weight: 600;
  font-size: 1.04rem;
}
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
