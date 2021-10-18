<template>
  <!--  <b-card-code-->
  <!--    no-body-->
  <!--    disabled-->
  <!--    title="Booking Slots"-->
  <!--  >-->
  <!--    <b-table-->
  <!--      responsive="sm"-->
  <!--      :fields="fields"-->
  <!--      :items="items"-->
  <!--    >-->
  <!--      <template #cell(time_slots)="data">-->
  <!--        <b-button-->
  <!--          v-for="x in data.value"-->
  <!--          :key="x.status"-->
  <!--          v-ripple.400="'rgba(40, 199, 111, 0.15)'"-->
  <!--          :variant="x.variant"-->
  <!--          pill-->
  <!--          style="margin: 0.5rem 1rem;"-->
  <!--        >-->
  <!--          {{ x.status }}-->
  <!--        </b-button>-->
  <!--      </template>-->
  <!--    </b-table>-->

  <!--  </b-card-code>-->
  <div />
</template>

<script>
// import BCardCode from '@core/components/b-card-code/BCardCode.vue'
// import { BTable, BButton } from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { Carousel3d, Slide3d } from 'vue-carousel-3d'

export default {
  components: {
    // BCardCode,
    // BTable,
    // BButton,

  },
  directives: {
    Ripple,
  },
  data() {
    return {
      fields: [
        {
          key: 'dates',
          sortable: false,
          label: 'Date',
        },
        {
          key: 'time_slots',
          sortable: false,
          label: 'Time Slots',
        },

      ],
      items: [
        {
          dates: '8th October',
          time_slots: [
            { status: '4:00PM', variant: 'outline-success' },
            { status: '6:00PM', variant: 'outline-danger' },
            { status: '9:00PM', variant: 'outline-secondary' },
          ],
        },
        {
          dates: '9th October',
          time_slots: [
            { status: '4:00PM', variant: 'outline-secondary' },
            { status: '6:00PM', variant: 'outline-success' },
            { status: '7:00PM', variant: 'outline-warning' },
            { status: '9:00PM', variant: 'outline-danger' },
          ],
        },

      ],
    }
  },
  methods: {
    dateFunc() {

    },

  },
}
</script>
