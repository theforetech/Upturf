<template>
  <b-card
    class="text-center main"
    @click="select"
  >

    <b-avatar
      class="mb-1"
      :variant="`light-${color}`"
      size="45"
    >
      <feather-icon
        size="21"
        :icon="icon"
      />
    </b-avatar>
    <div class="truncate">
      <h2
        class="mb-25 font-weight-bolder"
        style="font-size:1rem"
      >
        {{ statistic }}
      </h2>
    </div>
  </b-card>
</template>

<script>
import { BCard, BAvatar } from 'bootstrap-vue'

export default {
  components: {
    BCard,
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
    color: {
      type: String,
      default: 'primary',
    },
  },
  methods: {
    select() {
      this.$emit('clicked', true)
    },
  },
}
</script>
<style scoped>
.main{
  height: 10rem;

}
.main>.b-card-body{
  padding-bottom: 0rem;
}
[dir] .card-body {
       padding: 2rem 1.5rem 0rem 1.5rem;
     }
</style>
