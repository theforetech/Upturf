<template>
  <div
    class="base header-navbar navbar navbar-shadow"
    style="width: 100%;overflow: hidden!important; display: block !important; background: #fff;"
  >
    <b-row
      class="rows"
      align-v="center"
      style="padding-top: 0.4rem; padding-bottom: 0.4rem;"
    >
      <b-col style="padding-right: 0">
        <b-button
          v-ripple.400="'rgba(30, 30, 30, 0.15)'"
          variant="flat-dark"
          style="font-size:0.9rem;white-space:nowrap; padding-left: 0.2rem;padding-right: 0.2rem;border-bottom:1px dashed #242424;border-radius: 0px"
          @click="toggleBottom('location')"
        >
          <feather-icon
            icon="MapPinIcon"
            style="color: #7367F0"
          />
          <span
            v-if="filterLocation === null"
          >
            Pick your location . .
          </span>
          <span
            v-else
          >
            {{ ('name' in filterLocation) ? filterLocation.name : filterLocation.lat+','+filterLocation.lon }} . .
          </span>
        </b-button>
      </b-col>
      <b-col
        cols="3"
        align-self="center"
        style="padding-right: 0;"
      >
        <b-button
          variant="flat-success"
          class="btn-icon rounded-circle"
          @click="navigateTo('user-profile')"
        >
          <b-avatar
            size="40"
            class="align-baseline profile"
            :src="userInfo.photoURL"
            variant="light-primary"
          >
            <feather-icon
              v-if="!userInfo.displayName"
              icon="UserIcon"
              size="22"
            />
          </b-avatar>
        </b-button>
      </b-col>
    </b-row>
    <b-row
      v-if="search"
      class="rows"
      align-h="center"
      style="padding: 0.2rem 0.5rem 0 0.5rem; height: 3.7rem;"
    >
      <b-form-group
        label-for="vi-search-bar"
        class="searchBar"
      >
        <b-input-group
          class="input-group-merge searchInput"
        >
          <b-input-group-prepend
            is-text
          >
            <feather-icon
              icon="SearchIcon"
              class="searchIcon"
            />
          </b-input-group-prepend>
          <b-form-input
            id="vi-first-name"
            v-model="searchQuery"
            placeholder="Search for Turfs, Sports, etc . . ."
            class="searchInput field"
            @focus.native="onFocus"
          />
          <b-input-group-append v-if="searchQuery !== ''">
            <b-button
              variant="outline-primary"
              class="btn-icon"
            >
              <feather-icon
                icon="ArrowRightIcon"
                class="searchIcon"
              />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-row>
    <b-row
      v-if="search && (filters || calcFilters)"
      class="rows"
      style="padding-top: 0.2rem; padding-left: 0.5rem; padding-right: 0.5rem;"
    >
      <b-col
        cols="10"
        align-self="center"
        style="padding:0 0.7rem 0 0;"
      >
        <div
          class="filter-row"
        >
          <b-button
            v-for="x in filterbtns"
            :key="x.id"
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
            pill
            class="filter-btn"
            @click="toggleBottom(x.tag)"
          >
            {{ x.tag==='date'? finalDate: x.name }}
            <feather-icon
              v-if="!x.toggleable"
              icon="ChevronDownIcon"
              class="ml-20"
            />
            <feather-icon
              v-if="x.tag==='rating'&& filterFourPlus"
              icon="XIcon"
              class="ml-20"
            />
          </b-button>
        </div>

      </b-col>
      <!--      <b-col-->
      <!--        style="padding: 0;float: right;"-->
      <!--        align-h="center"-->
      <!--      >-->
      <div style="position:absolute;right:0">
        <b-button
          v-ripple.400="'rgba(113, 102, 240, 0.15)'"
          variant="primary"
          class="sort-btn"
          @click="toggleBottom('sort')"
        >
          Sort
          <feather-icon
            icon="ArrowDownIcon"
            class="ml-20"
          />
        </b-button>
      </div>

      <!--      </b-col>-->
    </b-row>
    <div
      class="overlay-dark"
      :class="{'open-overlay':isOpen}"
      style="position: fixed!important; height: 100vh!important;"
      @click="toggleBottom('closepopup')"
    />
    <div
      class="popup"
      :class="{'open':isOpen,'close':!isOpen}"
    >
      <div>
        <b-row
          style="padding: 0"
          align-h="center"
        >
          <b-button
            v-ripple.400="'rgba(40, 199, 111, 0.15)'"
            variant="flat-dark"
            class="btn-icon"
            style="padding: 0;"
            @click="toggleBottom('closepopup')"
          >
            <feather-icon
              icon="ChevronDownIcon"
              style="transform: scale(1.3,1);"
              size="30"
            />
          </b-button>
        </b-row>

      </div>
      <div v-show="whichPopup==='location'">
        <div>
          <b-row style="margin-top:1rem;margin-bottom: 1rem;">
            <b-col
              style="margin-left:1rem;"
              align-self="center"
            >
              <h1 style="font-size: 1.2rem;">
                Search Location
              </h1>
            </b-col>
            <b-col>
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="dark"
                style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
                :disabled="enableDone"
                @click="finalSelection"
              >
                Done
              </b-button>
            </b-col>
          </b-row>
          <b-row align-h="center">
            <b-col
              cols="11"
              align-h="center"
              style="padding:0;"
            >
              <b-form-group
                label-for="vi-search-bar"
                class="searchBar"
              >
                <b-input-group class="input-group-merge searchInput">
                  <b-input-group-prepend is-text>
                    <feather-icon
                      icon="SearchIcon"
                      class="searchIcon"
                    />
                  </b-input-group-prepend>
                  <b-form-input
                    id="vi-location"
                    v-model="vm.searchPlace"
                    v-gmaps-searchbox:location.name.geometry="vm"
                    placeholder="Search your location..."
                    class="searchInput field"
                    name="name"
                  />
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>
        </div>
        <div style="overflow-y:auto;overflow-x: hidden;height: 37rem; ">
          <b-row>
            <b-button
              v-ripple.400="'rgba(210, 151, 240, 0.15)'"
              variant="flat-primary"
              style="margin-left: 0.5rem"
              @click="geolocate"
            >
              <feather-icon
                icon="CrosshairIcon"
                style="color: #7367F0"
              />
              Use Current Location
            </b-button>
          </b-row>
          <!--          <b-row style="margin-top:1.6rem;margin-bottom: 1rem;">-->
          <!--            <b-col-->
          <!--              style="margin-left:1rem;"-->
          <!--            >-->
          <!--              <h1 style="font-size: 1.1rem;">-->
          <!--                Your Saved Locations-->
          <!--              </h1>-->
          <!--            </b-col>-->
          <!--          </b-row>-->
          <!--          <b-row>-->
          <!--            <address-card-->
          <!--              v-for="x in addresses"-->
          <!--              :key="x.id"-->
          <!--              :type="x.type"-->
          <!--              :tag="x.tag"-->
          <!--              :address="x.address"-->
          <!--              :pincode="x.pincode"-->
          <!--              :color="itemSelected(x)"-->
          <!--              style="width: 100%"-->
          <!--              @select="selectAddress(x)"-->
          <!--            />-->
          <!--          </b-row>-->
        </div>
      </div>
      <div
        v-show="whichPopup==='date'"
        style="margin-bottom: 6rem;"
      >
        <b-row style="margin-top:1rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
            align-self="center"
            cols="7"
          >
            <h1 style="font-size: 1.2rem;">
              Select date
            </h1>
          </b-col>
          <b-col>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="dark"
              style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
              :disabled="enableDateDone"
              @click="finalSelectionDate"
            >
              Done
            </b-button>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-calendar
            v-model="filterbtns[0].name"
            initial-date
            :min="min"
            :max="max"
            locale="en"
          />
        </b-row>

      </div>
      <div v-show="whichPopup==='sport'">
        <b-row style="margin-top:1rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
            align-self="center"
            cols="7"
          >
            <h1 style="font-size: 1.2rem;">
              Select Sports ( {{ selectedSports.length }} )
            </h1>
          </b-col>
          <b-col>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="dark"
              style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
              :disabled="enableSportDone"
              @click="finalSelectionSport"
            >
              Done
            </b-button>
          </b-col>
        </b-row>
        <b-row style="overflow: auto;height: 30rem;">
          <div style="overflow-y:auto;overflow-x: hidden; width:100%;margin-left: 2rem;background-color: #fff6f3; ">
            <b-form-checkbox
              v-for="options in optionsSport"
              :key="options.value"
              v-model="selectedSports"
              :value="options.value"
              class="checkbox"
            >
              <h1 style="font-size: 1.3rem;display: inline;">
                {{ options.text }}
              </h1>

              <b-img
                :src="options.img"
                style="width: 2.6rem;display: inline;float: right;margin-right: 1rem"
              />

            </b-form-checkbox>
          </div>

        </b-row>
      </div>
      <div v-show="whichPopup==='amenities'">
        <b-row style="margin-top:1rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
            align-self="center"
            cols="7"
          >
            <h1 style="font-size: 1.2rem;">
              Select Amenities ( {{ selectedAmenities.length }} )
            </h1>
          </b-col>
          <b-col>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="dark"
              style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
              :disabled="enableAmenitiesDone"
              @click="finalSelectionAmenities"
            >
              Done
            </b-button>
          </b-col>
        </b-row>
        <b-row style="overflow: auto;height: 30rem;">
          <div style="overflow-y:auto;overflow-x: hidden; width:100%;margin-left: 2rem;background-color: #fff6f3; ">
            <b-form-checkbox
              v-for="options in amenities"
              :key="options.value"
              v-model="selectedAmenities"
              :value="options.value"
              class="checkbox"
            >
              <h1 style="font-size: 1.3rem;display: inline;">
                {{ options.text }}
              </h1>
            </b-form-checkbox>
          </div>
        </b-row>
      </div>
      <div v-show="whichPopup==='timings'">
        <b-row style="margin-top:1rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
            align-self="center"
            cols="7"
          >
            <h1 style="font-size: 1.2rem;">
              Select Time Slots ( {{ selectedTimeslots.length }} )
            </h1>
          </b-col>
          <b-col>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="dark"
              style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
              :disabled="enableTimeDone"
              @click="finalSelectionTime"
            >
              Done
            </b-button>
          </b-col>
        </b-row>
        <b-row style="overflow: auto;height: 30rem;">
          <div style="overflow-y:auto;overflow-x: hidden; width:100%;margin-left: 2rem;background-color: #fff6f3; ">
            <b-form-checkbox
              v-for="options in timeSlots"
              :key="options.value"
              v-model="selectedTimeslots"
              :value="options.value"
              class="checkbox"
            >
              <h1 style="font-size: 1.3rem;display: inline;">
                {{ options.text }}
              </h1>

            </b-form-checkbox>
          </div>

        </b-row>
      </div>
      <div v-show="whichPopup==='sort'">
        <b-row style="margin-top:1rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
            align-self="center"
            cols="7"
          >
            <h1 style="font-size: 1.2rem;">
              Sort your turfs
            </h1>
          </b-col>
          <b-col>
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="dark"
              style="float:right;margin-right: 1rem;font-size: 0.9rem;padding: 0.8rem 0.9rem"
              :disabled="enableSortDone"
              @click="finalSelectionSort"
            >
              Done
            </b-button>
          </b-col>
        </b-row>
        <b-row style="overflow: auto;height: 30rem;">
          <div style="overflow-y:auto;overflow-x: hidden; width:100%;margin-left: 2rem;background-color: #fff6f3; ">
            <b-form-radio-group
              v-model="selectedSort"
              :options="optionsSort"
              value-field="name"
              text-field="item"
              disabled-field="notEnabled"
              class="radiobox"
              stacked
            />
          </div>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BRow, BButton, BFormGroup, BInputGroup, BFormInput, BInputGroupPrepend, BInputGroupAppend, BCol, BAvatar, BCalendar, BFormCheckbox, BImg, BFormRadioGroup,
} from 'bootstrap-vue'
import { mapGetters, mapMutations } from 'vuex'
import Ripple from 'vue-ripple-directive'
// import VuePlaceAutocomplete from 'vue-place-autocomplete'
import moment from 'moment'
import AddressCard from './AddressCard.vue'

export default {
  components: {
    BRow,
    BCol,
    BButton,
    BFormGroup,
    BInputGroup,
    BFormInput,
    BInputGroupPrepend,
    BInputGroupAppend,
    BAvatar,
    // eslint-disable-next-line vue/no-unused-components
    AddressCard,
    BCalendar,
    BFormCheckbox,
    BImg,
    BFormRadioGroup,
  },
  directives: {
    Ripple,
  },
  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 15th two months prior
    const minDate = new Date(today)
    // 15th in two months
    const maxDate = new Date(today)
    maxDate.setDate(maxDate.getDate() + 10)

    return {
      isOpen: false,
      calcFilters: false,
      vm: {
        searchPlace: '',
        location: {},
      },
      searchQuery: '',
      value: '',
      min: minDate,
      max: maxDate,
      finalDate: moment().format('ddd, MMM DD, YYYY'),
      selectedSort: 'popularity',
      finalSort: 'popularity',
      optionsSort: [
        {
          item: 'Popularity',
          name: 'popularity',
        },
        {
          item: 'Rating high to low ↑',
          name: 'ratingh2l',
        },
        {
          item: 'Pricing high to low ↑',
          name: 'pricingh2l',
        },
        {
          item: 'Pricing low to high ↓',
          name: 'pricingl2h',
        },

      ],
      whichPopup: '',
      popups: ['location', 'date', 'sport', 'amenities', 'timings', 'closepopup', 'sort'],
      addresses: [
        {
          id: '0',
          type: 'Home',
          tag: 'Home',
          address: 'Charmwood Village, Eros Garden, Faridabad, Haryana',
          pincode: '121009',
        },
        {
          id: '1',
          type: 'Home',
          tag: 'Home',
          address: 'Grandeur Appts, Gali number 5, third floor, Allahbad',
          pincode: '200229',
        },
        {
          id: '2',
          type: 'Home',
          tag: 'Home',
          address: 'Kachchi Bowling, Hyderbad',
          pincode: '200229',
        },
        {
          id: '3',
          type: 'Home',
          tag: 'Home',
          address: 'Kachchi Bowling, Hyderbad',
          pincode: '200229',
        },
        {
          id: '4',
          type: 'Home',
          tag: 'Home',
          address: 'Kachchi Bowling, Hyderbad',
          pincode: '200229',
        },
      ],
      filterbtns: [
        {
          id: 0,
          name: 'Date',
          tag: 'date',
          toggleable: false,
        },
        {
          id: 1,
          name: 'Rating 4+',
          tag: 'rating',
          toggleable: true,
        },
        {
          id: 2,
          name: 'Sport',
          tag: 'sport',
          toggleable: false,
        },
        {
          id: 3,
          name: 'Amenities',
          tag: 'amenities',
          toggleable: false,
        },
        {
          id: 4,
          name: 'Timings',
          tag: 'timings',
          toggleable: false,
        },
      ],
      selectedAddress: {},
      finalAddress: {},
      rating4: false,
      selectedSports: [],
      finalSport: [],
      selectedAmenities: [],
      finalAmenities: [],
      selectedTimeslots: [],
      finalTime: [],
      timeSlots: [
        {
          text: '6 AM to 9 AM',
          value: '06-09',
        },
        {
          text: '9 AM to 12 PM',
          value: '09-12',
        },
        {
          text: '3 PM to 6 PM',
          value: '15-18',
        },
        {
          text: '6 PM to 9PM',
          value: '18-21',
        },
        {
          text: '9 PM to 12AM',
          value: '21-00',
        },
      ],
      amenities: [
        {
          text: 'Air Conditioning',
          value: 'ac',
        },
        {
          text: 'Indoor',
          value: 'indoor',
        },
        {
          text: 'Clay Court',
          value: 'clay-court',
        },
        {
          text: 'Fully Sanitized',
          value: 'fully-sanitized',
        },
      ],
      optionsSport: [
        {
          text: 'Football',
          value: 'football',
          img: '/images/sports/Football.png',
        },
        {
          text: 'Rugby',
          value: 'rugby',
          img: '/images/sports/Rugby.png',
        },
        {
          text: 'Badminton',
          value: 'badminton',
          img: '/images/sports/Badminton.png',
        },
        {
          text: 'Basketball',
          value: 'basketball',
          img: '/images/sports/Basketball.png',
        },
      ],
      filters: true,
      search: true,
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/getActiveUser',
      overflowVal: 'app/overflowHidden',
      filterDate: 'filters/date',
      filterSearchQuery: 'filters/searchQuery',
      filterLocation: 'filters/location',
      filterSortBy: 'filters/sortBy',
      filterLoading: 'filters/loading',
      filterAmenities: 'filters/amenities',
      filterSports: 'filters/sports',
      filterTimings: 'filters/timings',
      filterFourPlus: 'filters/ratingFourPlus',
    }),
    // filters() {
    //   return 'filters' in this.$route.matched[0].meta && this.$route.matched[0].meta.filters
    // },
    // search() {
    //   return 'search' in this.$route.matched[0].meta && this.$route.matched[0].meta.search
    // },
    // sportSelect() {
    //   const x = this.sportImg.filter(item => item.name === this.sport)
    //   return x[0].img
    // },
    formattedDate() {
      if (this.filterbtns[0].name === 'Date') return moment().format('YYYY-MM-DD')
      return moment(this.filterbtns[0].name, 'YYYY-MM-DD').format('YYYY-MM-DD')
    },
    enableDone() {
      return false
      // return Object.keys(this.selectedAddress).length === 0
    },
    enableSportDone() {
      return this.selectedSports === this.filterSports
    },
    enableAmenitiesDone() {
      return this.selectedAmenities === this.filterAmenities
    },
    enableSortDone() {
      return this.selectedSort === this.filterAmenities
    },
    enableDateDone() {
      return this.filterbtns[0].name === 'date'
    },
    enableTimeDone() {
      return this.selectedTimeslots === this.filterTimings
    },
  },
  watch: {
    $route(val) {
      this.filters = 'filters' in val.matched[0].meta && val.matched[0].meta.filters
      this.search = 'search' in val.matched[0].meta && val.matched[0].meta.search
      this.calcFilters = false
    },
    filterSports(val) {
      this.selectedSports = val
    },
    filterAmenities(val) {
      this.selectedAmenities = val
    },
    filterTimings(val) {
      this.selectedTimeslots = val
    },
    searchQuery(val) {
      this.updateSearchQuery(val)
    },
  },
  mounted() {
    this.filters = 'filters' in this.$route.matched[0].meta && this.$route.matched[0].meta.filters
    this.search = 'search' in this.$route.matched[0].meta && this.$route.matched[0].meta.search
    this.selectedSports = this.filterSports
    this.selectedAmenities = this.filterAmenities
    this.selectedTimeslots = this.filterTimings
    this.selectedSort = this.filterSortBy
    this.searchQuery = this.filterSearchQuery
    // console.log(this.filters, this.search)
    // this.cross()
  },
  methods: {
    ...mapMutations({
      updateFilterDate: 'filters/UPDATE_DATE',
      updateSearchQuery: 'filters/UPDATE_SEARCH',
      updateFilterLocation: 'filters/UPDATE_LOCATION',
      updateFilterSortBy: 'filters/UPDATE_SORT_BY',
      updateFilterLoading: 'filters/UPDATE_LOADING',
      updateFilterAmenities: 'filters/UPDATE_AMENITIES',
      updateFilterSports: 'filters/UPDATE_SPORTS',
      updateFilterTimings: 'filters/UPDATE_TIMINGS',
      updateFilterFourPlus: 'filters/TOGGLE_FOUR_PLUS',
    }),
    geolocate() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.$store.commit('filters/UPDATE_LOCATION', { lat: position.coords.latitude, lon: position.coords.longitude })
          this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
          this.isOpen = false
        })
      }
    },
    onFocus() {
      if (!this.filters && !this.calcFilters) {
        this.calcFilters = this.calcFilters ? this.searchQuery !== '' : true
      }
    },
    navigateTo(page) {
      this.$router.push({
        name: page,
      })
    },
    // removeX() {
    //   this.$emit('clicke', true)
    // },
    toggleBottom(x) {
      if (x !== 'rating') {
        this.isOpen = !this.isOpen
        if (this.isOpen) this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', true)
        else this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
        if (x !== 'closepopup') {
          this.whichPopup = this.popups.find(item => x === item)
          if (x === 'location') {
            this.selectedAddress = this.finalAddress
          }
        }
      } else {
        this.updateFilterFourPlus()
      }
    },
    moment() {
      return moment()
    },
    selectAddress(item) {
      this.selectedAddress = item
    },
    itemSelected(item) {
      // console.log()
      return item.id === this.selectedAddress.id
    },
    async finalSelection() {
      const lat = await this.vm.location.geometry.location.lat()
      const lon = await this.vm.location.geometry.location.lng()
      this.$store.commit('filters/UPDATE_LOCATION', {
        lat,
        lon,
        name: this.vm.location.name,
      })
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    finalSelectionSport() {
      this.updateFilterSports(this.selectedSports)
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    finalSelectionAmenities() {
      this.updateFilterAmenities(this.selectedAmenities)
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    finalSelectionSort() {
      this.updateFilterSortBy(this.selectedSort)
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    finalSelectionDate() {
      this.updateFilterDate(this.formattedDate)
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    finalSelectionTime() {
      this.updateFilterTimings(this.selectedTimeslots)
      this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
      this.isOpen = false
    },
    ...mapMutations([
      'app/UPDATE_OVERFLOW_HIDDEN',
    ]),
  },

}
</script>
<style scoped>
.rows{
  margin: 0;
  padding-top: 0.9rem;padding-bottom: 0.4rem;
}
.rows:nth-child(2){
  margin: 0;
  padding-top: 0.2rem;padding-bottom: 0.4rem;
}
.searchBar{
  width: 98%;
}
.filter-row{
  overflow-x:auto;
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;

}
.searchInput{
  height: 3.5rem;
}
.filter-row::-webkit-scrollbar{
  display: none;
}
.filter-btn{
  margin: 0.5rem 0 0.4rem 0.4rem;
  font-size: 0.9rem;
  padding: 0.5rem 0.6rem;
  height: 2.5rem;
  transition: all ease-in-out 0.3s;
}

.sort-btn{
  margin: 0.42rem 0rem 0.4rem 0.2rem;
  font-size: 0.9rem;
  padding: 0.5rem 0.6rem;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  height: 2.7rem;
  z-index: 4;

}
.datePicker{
  width: 10rem;
}
.popup{
  position:fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff6f3;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  transition: all ease-in-out 0.3s;
  max-height: 38rem;
  z-index: 6;
  box-shadow: 0px -1px 4px rgba(256, 256, 256, 0.9);
}
.open{
  bottom: 0%;
  /*display: block;*/
}
.close{
  bottom:-100%;
}
.overlay-dark{
  position: absolute;
  background-color: rgba(0,0,0,0.6);
  z-index: 5;
  top:0;
  height: 100%;
  width: 100%;
  transition: all ease-in-out 0.3s;
  user-select: none;
  visibility: hidden;
}
.open-overlay{
  visibility: visible;
  transition:none;
}
.profile{
  float: right;
}
.checkbox{
  width: 100%;
  padding-bottom: 1rem ;
  overflow: auto;

}
.checkbox h1{

}
.custom-checkbox .custom-control-label{
  width: 100%;
}
.radiobox{
  font-size: 3rem;
}
</style>
<style lang="scss">
@import '@core/scss/vue/pages/page-faq.scss';
//$grid-breakpoints: (
//    xs: 0,
//    sm: 576px,
//    md: 768px,
//    lg: 992px,
//    xl: 1200px,
//    xxl: 1400px
//);
</style>
