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
          {{ statistic }}
        </h2>
        <span style="font-size: 0.9rem">{{ date }}  ₹ {{ statisticTitle }}</span>
      </div>
      <b-avatar
        :variant="`light-${color}`"
        size="30"
      >
        <feather-icon
          size="15"
          :icon="icon"
          @click="removeX"
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
      type: [Number, String],
      default: '',
    },
    color: {
      type: String,
      default: 'danger',
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
