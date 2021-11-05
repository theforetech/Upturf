<template>
  <div
    class="base"
    style="width: 100%;overflow: hidden!important;"
  >
    <b-row
      class="rows"
      align-v="center"
    >

      <b-col style="padding-right: 0">
        <b-button
          v-ripple.400="'rgba(30, 30, 30, 0.15)'"
          variant="flat-dark"
          style="font-size:0.9rem;white-space:nowrap; padding-left: 0.2rem;padding-right: 0.2rem;border-bottom:1px dashed #242424;border-radius: 0px"
          @click="toggleBottom"
        >
          <feather-icon
            icon="MapPinIcon"
            style="color: #7367F0"
          />
          <span
            v-if="Object.keys(finalAddress).length === 0"
          >
            Pick your location . .
          </span>
          <span
            v-else
          >
            {{ finalAddress.address.slice(0,27) }} . .
          </span>

        </b-button>

      </b-col>
      <b-col
        cols="3"
        align-self="center"
      >
        <b-avatar
          button
          variant="flat-dark"
          text="BA"
          src="/images/avatars/me.png"
          class="align-baseline profile"
          size="3rem"
        />
      </b-col>
    </b-row>
    <b-row
      class="rows"
      align-h="center"
      style="padding-bottom: 0"
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
            id="vi-first-name"
            placeholder="Search for Turfs, Sports, etc . . ."
            class="searchInput field"
          />
        </b-input-group>
      </b-form-group>
    </b-row>
    <b-row
      class="rows"
      style="padding-top: 0"
    >
      <div class="scrollFilters">

        <!--        <b-button class="filter-btn">-->
        <!--          Hello-->
        <!--        </b-button>-->
      </div>
    </b-row>
    <div
      class="overlay-dark"
      :class="{'open-overlay':isOpen}"
      @click="toggleBottom"
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
            @click="toggleBottom"
          >
            <feather-icon
              icon="ChevronDownIcon"
              style="transform: scale(1.3,1);"
              size="30"
            />
          </b-button>
        </b-row>
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
                  placeholder="Search your location..."
                  class="searchInput field"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <div style="width:100%;overflow-y:auto;overflow-x: hidden; ">
        <b-row>
          <b-button
            v-ripple.400="'rgba(210, 151, 240, 0.15)'"
            variant="flat-primary"
            style="margin-left: 0.5rem"
          >
            <feather-icon
              icon="CrosshairIcon"
              style="color: #7367F0"
            />
            Use Current Location
          </b-button>
        </b-row>
        <b-row style="margin-top:1.6rem;margin-bottom: 1rem;">
          <b-col
            style="margin-left:1rem;"
          >
            <h1 style="font-size: 1.1rem;">
              Your Saved Locations
            </h1>
          </b-col>
        </b-row>
        <b-row>
          <address-card
            v-for="x in addresses"
            :key="x.id"
            :type="x.type"
            :tag="x.tag"
            :address="x.address"
            :pincode="x.pincode"
            :color="itemSelected(x)"
            style="width: 100%"
            @select="selectAddress(x)"
          />
        </b-row>
      </div>

    </div>
  </div>
</template>

<script>
import {
  BRow, BButton, BFormGroup, BInputGroup, BFormInput, BInputGroupPrepend, BCol, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
// import VuePlaceAutocomplete from 'vue-place-autocomplete'
import { mapMutations } from 'vuex'
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
    BAvatar,
    AddressCard,
  },
  directives: {
    Ripple,
  },

  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    // 15th two months prior
    const minDate = new Date(today)
    minDate.setMonth(minDate.getMonth() - 2)
    minDate.setDate(15)
    // 15th in two months
    const maxDate = new Date(today)
    maxDate.setMonth(maxDate.getMonth() + 2)
    maxDate.setDate(15)

    return {
      value: '',
      min: minDate,
      max: maxDate,
      isOpen: false,
      addresses: [{
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
      selectedAddress: {},
      finalAddress: {},
    }
  },
  computed: {
    // sportSelect() {
    //   const x = this.sportImg.filter(item => item.name === this.sport)
    //   return x[0].img
    // },
    enableDone() {
      return Object.keys(this.selectedAddress).length === 0
    },
  },
  mounted() {
    // this.cross()
  },
  methods: {
    // removeX() {
    //   this.$emit('clicke', true)
    // },
    toggleBottom() {
      this.isOpen = !this.isOpen
      this.selectedAddress = this.finalAddress
      if (this.isOpen) this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', true)
      else this.$store.commit('app/UPDATE_OVERFLOW_HIDDEN', false)
    },
    selectAddress(item) {
      this.selectedAddress = item
    },
    itemSelected(item) {
      // console.log()
      return item.id === this.selectedAddress.id
    },
    finalSelection() {
      this.finalAddress = this.selectedAddress
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
.searchInput{
  height: 3.5rem;
}
.scrollFilters{
  white-space: nowrap;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollFilters::-webkit-scrollbar{
  display: none;
}
.filter-btn{
  margin-left: 1rem;
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
  transition-delay: 0.3s;
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
</style>
