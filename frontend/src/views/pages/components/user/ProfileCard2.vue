<template>
  <b-card
    no-body
    @click="select"
  >
    <b-card-body style="padding: 1rem 0rem;">
      <div>
        <b-avatar
          :variant="`light-${color}`"
          size="35"
        >
          <feather-icon
            size="18"
            :icon="icon"
          />
        </b-avatar>
        <span style="margin-left: 1rem;font-weight: 600">
          {{ statistic }}
        </span>
      </div>
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
