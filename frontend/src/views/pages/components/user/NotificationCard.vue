<template>
  <b-card
    no-body
    @click="select"
  >
    <b-card-body style="padding: 1rem 0rem;">
      <div>
        <b-row>
          <b-col
            style="padding: 0 0.5rem 0 0.3rem"
            cols="2"
          >
            <b-avatar
              :variant="`light-${color}`"
              size="45"
              src=""
              class="upturf"
            />
          </b-col>
          <b-col style="padding: 0">
            <span style="font-weight: 500;">
              {{ statistic }}
            </span>
          </b-col>
        </b-row>
        <hr>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import {
  BCard, BCardBody, BAvatar, BRow, BCol,
} from 'bootstrap-vue'

export default {
  components: {
    BCard,
    BCardBody,
    BAvatar,
    BRow,
    BCol,
  },
  props: {
    icon: {
      type: String,
      required: false,
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
.upturf{
  height: 100%;
}

</style>
