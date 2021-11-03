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
        </b-button>
      </b-card-header>
      <b-card-body>
        <b-button>Hello</b-button>
      </b-card-body>
    </b-card>
    <b-card>
      <b-card-body />
    </b-card>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BButton,
  BCardBody,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BCard,
    BButton,
    BCardHeader,
    BCardBody,
    // eslint-disable-next-line vue/no-unused-components
    BRow,
    // eslint-disable-next-line vue/no-unused-components
    BCol,
  },
  directives: {
    Ripple,
  },
  data() {
    return {

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
