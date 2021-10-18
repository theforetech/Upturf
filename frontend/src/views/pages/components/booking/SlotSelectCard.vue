<template>
  <b-card
    no-body
    class="slotCard"
    @click="select()"
  >
    <b-card-body class="d-flex justify-content-between align-items-center">
      <div class="truncate">
        <h2
          class="mb-25 font-weight-bolder"
          style="font-size: 1rem"
        >
          {{ statistic }}
        </h2>
        <span style="font-size: 0.9rem">₹ {{ statisticTitle }}</span>
      </div>
      <b-avatar
        :variant="`light-${color}`"
        size="25"
      >
        <feather-icon
          size="12"
          :icon="icon"
        />
      </b-avatar>
    </b-card-body>
  </b-card>
</template>

<script>
import { BCard, BCardBody, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    statistic: {
      type: [Number, String],
      required: true,
    },
    statisticTitle: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: 'primary',
    },
    date: {
      type: String,
      default: '',
    },
    // cross: {
    //   type: Function,
    // },
  },
  mounted() {
    // this.cross()
  },
  methods: {
    select() {
      this.$emit('clicked', true)
    },
  },
}
</script>
<style scoped>
.slotCard{
  background-color: #f8f8f8;
  border: 1px rgba(169, 169, 169, 0.6) solid;
  height: 3.6rem;
}
</style>
