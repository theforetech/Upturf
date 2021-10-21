<template>
  <div>
    <b-card
      no-body
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
    <BookedCard
      v-for="x in bookings"
      :key="x.id"
      :turf="x.turf"
      :slots="x.slots"
      :amount="x.amount"
      :facility="x.facility"
      :sport="x.sport"
      :tag="x.tag"
      :date="x.date"
    />
    <b-card>
      <b-card-body />
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardHeader,
  BButton,
  BCardBody,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import BookedCard from './BookedCard.vue'

export default {
  components: {
    BCard,
    BButton,
    BCardHeader,
    BCardBody,
    BookedCard,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      bookings: [
        {
          id: '0',
          turf: 'Sirifort Stadium',
          sport: 'Football',
          facility: '3 v 3',
          slots: 3,
          amount: '3000',
          tag: 'Upcoming',
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
      ],
    }
  },

  methods: {
    navigateBack() {
      this.$router.go(-1)
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
