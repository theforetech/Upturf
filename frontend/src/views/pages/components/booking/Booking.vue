<template>
  <div>
    <div id="razorpay" />
    <div v-if="showSummary===0">
      <div style="padding-bottom: 2rem">
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
            </b-button> <span style="margin: auto;font-size: 1.2rem;font-weight: 500">{{ turfData.name }}</span>
          </b-card-header>
        </b-card>
        <b-card>
          <b-card-header style="padding-top:0;padding-right:0;padding-left: 0">
            <span style="font-size: 1.1rem;font-weight: 500;color:rgb(24, 24, 24);line-height: 2">
              Facility(s)
            </span>
            <b-dropdown
              id="dropdown-grouped"
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="outline-dark"
              block
              center
              class="dropdown facDrop"
              menu-class="w-100"
            >
              <template #button-content>
                <span
                  v-if="selected"
                  class="mr-1"
                >
                  <img
                    :src="selected.sport.images[0].url"
                    style="width:1.5rem"
                  >
                  &nbsp;&nbsp;:&nbsp;&nbsp;{{ selected.sport.name[0].toUpperCase() + selected.sport.name.slice(1) }} - {{ selected.type }}</span>
                <span
                  v-else
                  class="mr-1"
                >Please select a facility</span>
              </template>

              <b-dropdown-item
                v-for="x in turfData.facilities"
                :key="x.id"
                @click="selectFacility(x)"
              >
                <span class="mr-1"><img
                  :src="x.sport.images[0].url"
                  style="width:1.5rem"
                >&nbsp;&nbsp;:&nbsp;&nbsp;{{ x.sport.name[0].toUpperCase() + x.sport.name.slice(1) }} - {{ x.type }}</span>
              </b-dropdown-item>

            </b-dropdown>
          </b-card-header>
          <b-card-body
            class="date"
          >
            <span style="font-size: 1.1rem;font-weight: 500;color:rgb(24, 24, 24);line-height: 2">
              Select your date.
            </span>
            <VueSlickCarousel
              ref="carousel"
              v-bind="settings"
            >
              <div
                v-for="(x,i) in daysOfWeek"
                :key="'date_'+x"
              >
                <b-button
                  class="date-btn"
                  :class="{
                    'date-active': isDateSelected(moment().add(i,'d').toISOString())
                  }"
                  @click="getDate(moment().add(i,'d'))"
                >
                  {{ moment().add(i,'d').format('ddd') }} <br>
                  {{ moment().add(i,'d').format('MMM Do') }}
                </b-button></div>
            </VueSlickCarousel>
          </b-card-body>
        </b-card>
        <b-card>
          <b-card-header style="padding:0;">
            <span style="font-size: 1.1rem;font-weight: 500;color:rgb(24, 24, 24);line-height: 2"> Slot(s) Selection:</span>
          </b-card-header>
          <b-card-body
            v-if="!slotsFetching"
            style="padding: 0rem;"
          >
            <template v-if="slots.length > 0">
              <slot-select-card
                v-for="x in slots"
                :key="'slots_' + x.id"
                :disabled="x.disabled"
                :icon="getIcon(isRowSelected(x))"
                :statistic="x.start_time"
                :statistic-title="x.price"
                :date="checkoutDate"
                :color="getSlotColor(isRowSelected(x))"
                :border-color="getBorderColor(isRowSelected(x))"
                class="slotCard"
                @clicked="toggleRow(x)"
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
                  <span>No slots available!</span>
                </div>
              </b-alert>
            </div>
          </b-card-body>
          <b-card-body v-else>
            <b-skeleton-table
              class="mt-4"
              :rows="7"
              :columns="4"
              :table-props="{ bordered: true, striped: true }"
            />
          </b-card-body>
        </b-card>
      </div>

      <div class="booking-bar">
        <span>Slot(s) : {{ getSelectedFacilities }} • &nbsp; ₹ {{ getTotal }} Plus Charges </span>
        <b-button
          v-ripple.400="'rgba(40, 199, 111, 0.3)'"
          :disabled="!canCheckout"
          @click="summary()"
        >
          Summary →
        </b-button>
      </div>
    </div>
    <div v-else-if="showSummary===1">
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
          </b-button> <span style="margin: auto;font-size: 1.2rem;font-weight: 500">{{ turfData.name }}</span>
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
            :key="'slots_' + x.id"
            icon="Trash2Icon"
            :statistic="x.start_time"
            :statistic-title="x.price"
            :date="moment(checkoutDate).format('YYYY-MMM-DD')"
            class="slotCard"
            @clicke="removeSlot(x)"
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
          <!--          <div class="checkout">-->
          <!--            <span>Convenience fee (5% Base Fare):</span>-->
          <!--            <span>₹ {{ convFees }}</span>-->
          <!--          </div>-->
          <!--          <div class="checkout">-->
          <!--            <span>Coupon Discount:</span>-->
          <!--            <span style="color: #2BB053">-₹ {{ discount }}</span>-->
          <!--          </div>-->
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
      <b-card>
        <b-card-header style="padding :0px">
          <div style="width:100%;margin-bottom: 1rem;font-size: 1.1rem;font-weight: bold">
            Contact Details:
          </div>
          <validation-observer ref="bookDataForm">
            <b-form>
              <b-row>
                <b-col md="6">
                  <b-form-group>
                    <validation-provider
                      #default="{ errors }"
                      name="Name"
                      rules="required"
                    >
                      <b-form-input
                        v-model="contactName"
                        :state="errors.length > 0 ? false:null"
                        placeholder="Name"
                      />
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group>
                    <validation-provider
                      #default="{ errors }"
                      name="Phone Number"
                      :rules="{ required }"
                    >
                      <b-input-group>
                        <b-input-group-prepend is-text>
                          IN (+91)
                        </b-input-group-prepend>
                        <cleave
                          id="phone"
                          v-model="contactPhone"
                          class="form-control"
                          :raw="false"
                          :options="phoneOptions"
                          placeholder="77991 44423"
                        />
                      </b-input-group>
                      <small class="text-danger">{{ errors[0] }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </b-card-header>
        <b-card-body style="padding: 0rem;" />
      </b-card>
      <div class="booking-bar">
        <span>Slot(s) : {{ slotsSelected }} • &nbsp; ₹ {{ checkoutAmt }} Plus Tax </span>
        <b-button
          v-ripple.400="'rgba(40, 199, 111, 0.3)'"
          :disabled="!canCheckout"
          @click="validationForm"
        >
          Checkout →
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
            src="/images/loading/loading2.gif"
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
    <div v-else-if="showSummary===3">
      <b-row
        class="vh-100 text-center"
        align-h="center"
        align-v="center"
      ><b-col />
        <b-col
          cols="10"
        >
          <b-img
            src="/images/loading/payment.gif"
            fluid-growth
            style="height: 20rem;margin:auto"
          />
          <h2 style="margin-left: 1rem">
            Complete payment...
          </h2>
        </b-col>
        <b-col />
      </b-row>
    </div>
    <div v-else-if="showSummary===4">
      <b-row
        class="vh-100 text-center"
        align-h="center"
        align-v="center"
      ><b-col />
        <b-col
          cols="10"
        >
          <b-img
            src="/images/loading/payment.gif"
            fluid-growth
            style="height: 20rem;margin:auto"
          />
          <h2 style="margin-left: 1rem">
            Booking Confirmed!
          </h2>
        </b-col>
        <b-col />
      </b-row>
    </div>
    <div v-else-if="showSummary===5">
      <b-row
        class="vh-100 text-center"
        align-h="center"
        align-v="center"
      ><b-col />
        <b-col
          cols="10"
        >
          <b-img
            src="/images/loading/payment.gif"
            fluid-growth
            style="height: 20rem;margin:auto"
          />
          <b-button
            v-ripple.400="'rgba(40, 199, 111, 0.3)'"
            style="margin-left: 1rem"
            :disabled="retries > 4"
            @click="displayRazorpay"
          >
            Retry Payment →
          </b-button>
          <b-button
            v-ripple.400="'rgba(40, 199, 111, 0.3)'"
            style="margin-left: 1rem"
            variant="danger"
            @click="cancelBooking"
          >
            Cancel →
          </b-button>
        </b-col>
        <b-col />
      </b-row>
    </div>
  </div>

</template>

<script>
import {
  BCardHeader, BCardBody, BCard, BButton, BImg, BRow, BCol, BDropdown, BDropdownItem, BInputGroup, BInputGroupPrepend, BSkeletonTable, BFormInput, BFormGroup, BForm, BAlert,
} from 'bootstrap-vue'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.in'
import { required } from '@validations'
import VueSlickCarousel from 'vue-slick-carousel'
// import { Carousel3d, Slide } from 'vue-carousel-3d'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import moment from 'moment'
import gql from 'graphql-tag'
import Ripple from 'vue-ripple-directive'
import { mapGetters } from 'vuex'
import ToastificationContent
  from '../../../../@core/components/toastification/ToastificationContent.vue'
import SlotCard from './SlotCard.vue'
import SlotSelectCard from './SlotSelectCard.vue'

export default {
  components: {
    Cleave,
    BInputGroup,
    BInputGroupPrepend,
    BAlert,
    ValidationProvider,
    ValidationObserver,
    BFormInput,
    BFormGroup,
    BForm,
    BCardHeader,
    BCardBody,
    BCard,
    BButton,
    BSkeletonTable,
    VueSlickCarousel,
    SlotCard,
    BImg,
    BRow,
    BCol,
    BDropdown,
    BDropdownItem,
    SlotSelectCard,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      required,
      phoneOptions: { phone: true, phoneRegionCode: 'IN' },
      retries: 0,
      contactName: this.$store.state.user.AppActiveUser.displayName,
      contactPhone: '',
      currentBooking: null,
      slotsFetching: true,
      turfID: null,
      facilityID: null,
      turfData: {},
      facilityData: {},
      facilities: [{
        sport: 'Badminton',
        type: '1v1',
      },
      {
        sport: 'Badminton',
        type: '2v2',
      },
      {
        sport: 'Football',
        type: '3v3',
      },
      {
        sport: 'Football',
        type: '5v5',
      },
      ],
      date: moment().format('YYYY-MM-DD'),
      turf: {
        name: 'Sirifort Sport Complex',
      },
      slotts: [],
      selectedSlots: [],
      selectedDate: [{
        date: '2021-10-20',
        slots: [
          {
            id: '0',
            available: true,
            price: '1000',
            time: '6:00PM',
          },
          {
            id: '1',
            available: true,
            price: '1000',
            time: '7:00PM',
          },
          {
            id: '2',
            available: true,
            price: '1000',
            time: '8:00PM',
          },
          {
            id: '3',
            available: true,
            price: '1400',
            time: '9:00PM',
          },
        ],
      }],
      dates: [
        {
          date: '2021-10-20',
          slots: [
            {
              id: '0',
              available: true,
              price: '1000',
              time: '6:00PM',
            },
            {
              id: '1',
              available: true,
              price: '1000',
              time: '7:00PM',
            },
            {
              id: '2',
              available: true,
              price: '1000',
              time: '8:00PM',
            },
            {
              id: '3',
              available: true,
              price: '1400',
              time: '9:00PM',
            },
          ],
        },
        {
          date: '2021-10-21',
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
      checkoutDate: moment().toISOString(),
      convFees: 0,
      discount: 0,
      checkoutAmt: 0,
      selected: null,
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'user/getUserProfile',
    }),
    getTotal() {
      if (this.selectedSlots.length < 0) {
        return 0
      }
      let sum = 0
      this.selectedSlots.forEach(slot => {
        sum += slot.price
      })
      return sum
    },
    getSelectedFacilities() {
      return this.selectedSlots.length
    },
  },
  created() {
    // console.log(this.$route.params)
    this.turfID = this.$route.params.turf
    this.facilityID = this.$route.params.facility
    if (this.turfID === undefined || this.turfID === null || this.turfID === '') {
      this.$router.go(-1)
    }
  },
  async mounted() {
    // console.log(this.turfID, this.facilityID)
    if (this.userProfile.length > 0 && this.userProfile[0].name) {
      this.contactName = this.userProfile[0].name
      this.contactPhone = this.userProfile[0].phone_number
    }
    await this.getTurfData()
    await this.getFacilityData()
    this.checkoutDate = moment().toISOString()
    await this.getSlots()
  },
  methods: {
    validationForm() {
      this.$refs.bookDataForm.validate().then(success => {
        if (success) {
          this.checkout()
        }
      })
    },
    isDateSelected(date) {
      const d1 = moment(date).format('YYYY-MM-DD')
      const d2 = moment(this.checkoutDate).format('YYYY-MM-DD')
      if (d1 === d2) {
        return true
      }
      return false
    },
    async selectFacility(x) {
      this.facilityID = x.id
      this.selected = x
      await this.getFacilityData()
      await this.getSlots()
    },
    async getTurfData() {
      const result = await this.$apollo.query({
        query: gql`query ($id: bigint!) {
          turf_by_pk(id: $id) {
            id
            name
            pincode
            city
            about
            contactPhone
            gMapsBusinessLink
            address
            images{
              url
              id
            }
            facilities {
              id
              type
              price
              weekendPrice
              sport{
                id
                name
                images{
                  url
                }
              }
            }
            ratings_aggregate {
              aggregate {
                avg {
                  ratings
                }
              }
            }
          }
        }`,
        variables: {
          id: this.turfID,
        },
      })
      const turf = result.data.turf_by_pk
      const t = {
        ...turf,
        rating: turf.ratings_aggregate.aggregate.avg.ratings,
        sports: [],
      }
      delete t.ratings_aggregate
      const dict = {}
      turf.facilities.forEach(facility => {
        if (facility.id === this.facilityID) {
          this.selected = facility
        }
        if (!(facility.sport.id in dict)) {
          dict[facility.sport.id] = true
          t.sports.push({
            id: facility.sport.id,
            name: facility.sport.name,
            image: facility.sport.images[0].url,
          })
        }
      })
      this.turfData = t
    },
    async getFacilityData() {
      const result = await this.$apollo.query({
        query: gql`query ($id: Int!) {
          facilities_by_pk(id: $id) {
            id
            max_players
            name
            price
            slot_size
            sport {
              id
              name
              images {
                url
              }
            }
            weekendPrice
            type
            status
          }
        }`,
        variables: {
          id: this.facilityID,
        },
      })
      this.facilityData = result.data.facilities_by_pk
    },
    async getSlots() {
      this.slotsFetching = true
      this.selectedSlots = []
      let result = null
      if (moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').isSame(moment(moment(this.checkoutDate).format('YYYY-MM-DD'), 'YYYY-MM-DD'))) {
        result = await this.$apollo.query({
          query: gql`query ($date: date, $id: Int!, $time: time) {
          facilities_by_pk(id: $id) {
            id
            slots(where: {start_time: {_gt: $time}}) {
              disabled
              end_time
              id
              start_time
              booked_slots_aggregate(where: {_and: {date: {_eq: $date}, booking: {_and: {booking_status: {_in: [0, 1]}, payment_status: {_in: [processing, success]}}}}}) {
                aggregate {
                  count
                }
              }
            }
          }
        }`,
          variables: {
            id: this.facilityID,
            date: moment(this.checkoutDate).format('YYYY-MM-DD'),
            time: moment().format('HH:mm:ss'),
          },
          fetchPolicy: 'no-cache',
        })
      } else {
        result = await this.$apollo.query({
          query: gql`query ($date: date, $id: Int!) {
          facilities_by_pk(id: $id) {
            id
            slots {
              disabled
              end_time
              id
              start_time
              booked_slots_aggregate(where: {_and: {date: {_eq: $date}, booking: {_and: {booking_status: {_in: [0, 1]}, payment_status: {_in: [processing, success]}}}}}) {
                aggregate {
                  count
                }
              }
            }
          }
        }`,
          variables: {
            id: this.facilityID,
            date: moment(this.checkoutDate).format('YYYY-MM-DD'),
          },
          fetchPolicy: 'no-cache',
        })
      }
      let { price } = this.facilityData
      if (moment(this.checkoutDate).day() === 0 || moment(this.checkoutDate).day() === 6) {
        price = this.facilityData.weekendPrice
      }
      this.slots = result.data.facilities_by_pk.slots.map(slot => ({
        id: slot.id,
        start_time: moment(slot.start_time, 'HH:mm:ss').format('hh:mm A'),
        end_time: moment(slot.end_time, 'HH:mm:ss').format('hh:mm A'),
        disabled: slot.disabled || slot.booked_slots_aggregate.aggregate.count !== 0,
        date: this.checkoutDate,
        price,
      }))
      this.slots = this.slots.filter(slot => !slot.disabled)
      // console.log(this.slots)
      this.slotsFetching = false
    },
    moment() {
      return moment()
    },
    getDate(date) {
      this.checkoutDate = date.toISOString()
      this.getSlots()
    },
    onRowSelected(item) {
      this.selectedSlots.push(item)
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
      this.slotsSelected = this.selectedSlots.length
      for (let i = 0; i < this.selectedSlots.length; i += 1) {
        this.tempPrice += parseInt(this.selectedSlots[i].price, 10)
      }
      this.totalPrice = this.tempPrice
      this.tempPrice = 0
      this.canCheckout = this.slotsSelected > 0
    },
    toggleRow(item) {
      if (this.isRowSelected(item)) this.onRowUnSelected(item)
      else this.onRowSelected(item)
    },
    removeSlot(item) {
      this.selectedSlots = this.selectedSlots.filter(slot => slot.id !== item.id)
      this.slotsSelected = this.selectedSlots.length
      if (this.slotsSelected > 0) {
        for (let i = 0; i < this.selectedSlots.length; i += 1) {
          this.tempPrice += parseInt(this.selectedSlots[i].price, 10)
        }
        this.totalPrice = this.tempPrice
        this.tempPrice = 0
        this.canCheckout = this.slotsSelected > 0
        this.checkoutAmt = this.totalPrice
      } else this.showSummary = 0
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
    goBack() {
      this.$router.go(-1)
    },
    summary() {
      if (this.showSummary === 1) {
        this.showSummary = 0
      } else if (this.selectedSlots.length > 0) {
        this.showSummary = 1
        // this.convFees = this.totalPrice * 0.05
        // this.discount = this.totalPrice * 0.2
        this.checkoutAmt = this.totalPrice
      }
    },
    loadScript(src) {
      return new Promise(resolve => {
        if (document.getElementById('razorpay').childElementCount !== 1) {
          const script = document.createElement('script')
          script.src = src
          script.onload = () => {
            resolve(true)
          }
          script.onerror = () => {
            resolve(false)
          }
          document.getElementById('razorpay').appendChild(script)
        } else {
          resolve(true)
        }
      })
    },
    async displayRazorpay() {
      const vm = this
      const res = await this.loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!res) {
        // eslint-disable-next-line no-alert
        alert('Razorpay SDK failed to load. Are you online?')
        return
      }
      const options = {
        key: 'rzp_live_F39TocjF1ks8QX',
        currency: 'INR',
        amount: (this.currentBooking.amount * 100).toString(),
        order_id: this.currentBooking.razorpay,
        name: 'Booking Payment',
        prefill: {
          name: this.$store.state.user.userProfile[0].name,
          email: this.$store.state.user.AppActiveUser.email,
          contact: this.$store.state.user.userProfile[0].phone_number,
        },
        retry: {
          enabled: true,
          max_count: 5,
        },
        description: `Booking ID: ${this.currentBooking.id}`,
        image: 'https://upturf.in/logo.png',
        handler() {
          vm.$toast({
            component: ToastificationContent,
            props: {
              title: 'Success!',
              icon: 'CheckIcon',
              text: 'Payment Confirmed.',
              variant: 'success',
            },
          })
          vm.showSummary = 4
          setTimeout(() => {
            vm.$router.push({
              name: 'user-bookings',
              params: {
                refresh: true,
              },
            })
          }, 3000)
        },
        modal: {
          ondismiss() {
            // console.log('Checkout form closed')
            vm.showSummary = 5
            vm.retries += 1
          },
        },
      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.on('payment.failed', () => {
        vm.retries += 1
        if (vm.retries > 4) {
          paymentObject.close()
        }
      })
      paymentObject.open()
    },
    async checkout() {
      this.showSummary = 2
      await new Promise(r => setTimeout(r, 1400))
      const slots = []
      this.selectedSlots.forEach(slot => {
        slots.push(slot.id)
      })
      const res = await this.$apollo.mutate({
        mutation: gql`mutation ($contactName: String, $contactPhone: String, $date: date, $facility: Int!, $slots: [bigint!]) {
          book(contactName: $contactName, contactPhone: $contactPhone, date: $date, facility: $facility, slots: $slots) {
            amount
            razorpay
            id
          }
        }`,
        variables: {
          facility: this.facilityID,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          date: moment(this.checkoutDate).format('YYYY-MM-DD'),
          slots,
        },
      }).catch(e => {
        let msg = e.message
        if (e.message.includes('Uniqueness violation') || e.message.includes('Slot')) {
          msg = 'Slot unavailable'
        }
        this.currentBooking = null
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Booking',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
        this.showSummary -= 1
      })
      try {
        if (res === undefined || !('data' in res) || !('book' in res.data) || !res.data.book) {
          return
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Booking Created!',
            icon: 'CheckIcon',
            text: 'Complete payment within 15 minutes.',
            variant: 'success',
          },
        },
        {
          timeout: 4000,
        })
        this.currentBooking = res.data.book
        this.showSummary += 1
        await this.displayRazorpay()
      } catch (e) {
        let msg = e.message
        if (e.message.includes('Uniqueness violation')) {
          msg = 'Slot unavailable'
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Booking',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
        this.showSummary -= 1
      }
    },
    async cancelBooking() {
      this.showSummary = 2
      await new Promise(r => setTimeout(r, 1400))
      const res = await this.$apollo.mutate({
        mutation: gql`mutation ($id: uuid!) {
          cancel(bookingID: $id) {
            id
            refund
            status
          }
        }`,
        variables: {
          id: this.currentBooking.id,
        },
      }).catch(e => {
        let msg = e.message
        if (e.message.includes('Uniqueness violation')) {
          msg = 'Slot unavailable'
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Cancelling',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
        this.$router.push({ name: 'pages-turf', params: { id: this.turfID } })
      })
      try {
        let text = 'Booking Cancelled.'
        if ('refundID' in res.data && res.data.refundID) {
          text = `${text} Refund initiated with id: ${res.data.refundID}`
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Success!',
            icon: 'CheckIcon',
            text,
            variant: 'success',
          },
        })
        this.$router.push({ name: 'pages-turf', params: { id: this.turfID } })
      } catch (e) {
        let msg = e.message
        if (e.message.includes('Uniqueness violation')) {
          msg = 'Slot unavailable'
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Cancelling',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
        this.$router.push({ name: 'pages-turf', params: { id: this.turfID } })
      }
    },
    getIcon(icon) {
      if (icon) {
        return 'CheckIcon'
      }
      return 'MinusIcon'
    },
    getSlotColor(color) {
      if (color) return 'success'
      return 'secondary'
    },
    getBorderColor(item) {
      if (item) return 'slotCardSelected'
      return 'slotCard'
    },
    onClick() {
      // Close the menu and (by passing true) return focus to the toggle button
      this.$refs.dropdown.hide(true)
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
  color: #141414!important;
  font-weight: 500;
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
[dir] .date-btn:hover:not(.disabled):not(:disabled) {
  background: #202023!important;
  color:white!important;
}
.date-active {
  background: #202023!important;
  color:white!important;
}
.facDrop{
  width: 100%;
}
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
