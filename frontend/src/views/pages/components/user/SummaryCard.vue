<template>
  <b-card
    no-body
    class="slotCard"
  >
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h2
          class="mb-25 font-weight-bolder"
          style="font-size: 1.1rem"
        >
          {{ timeSlot }}
        </h2>
        <span style="font-size: 0.9rem">{{ date }}  ₹ {{ cost }}</span>
      </div>
      <b-img
        style="height: 2.5rem"
        :src="sportSelect"
      />
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody, BImg } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BImg,
  },
  props: {
    timeSlot: {
      type: String,
      required: true,
      default: '',
    },
    cost: {
      type: String,
      default: '',
    },
    sport: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '',
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
    }
  },
  computed: {
    sportSelect() {
      const x = this.sportImg.filter(item => item.name === this.sport)
      return x[0].img
    },
  },
  mounted() {
    // this.cross()
  },
  methods: {
    removeX() {
      this.$emit('clicke', true)
    },
  },

}
</script>
<style scoped>
.slotCard{
  background-color: #f8f8f8;
  border: 1px rgba(169, 169, 169, 0.6) solid;
  height: 4.2rem;
}
</style>
