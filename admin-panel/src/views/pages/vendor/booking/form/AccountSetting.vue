<template>
  <div>
    <div class="p-2 p-sm-3">
      <div class="w-100">
        <b-row>
          <b-col
            sm="12"
            class="d-xs-block d-md-none mb-2"
          >
            <div>
              <h2
                class="mb-2"
              >
                <vuexy-logo />
                <!--          <h2 class="brand-text text-primary ml-1">-->
                <!--            Surf A Turf-->
                <!--          </h2>-->
              </h2>
              <h2>
                Let's Create a new Booking!
              </h2>
              <h4 class="mb-2">
                Choose the turf & facility first.
              </h4>
              <!-- image -->
              <b-img
                fluid
                class="p-2 mt-2 mb-4"
                :src="require('@/assets/images/pages/error.svg')"
                alt="Create Profile Page"
              />
              <!-- alert -->
              <b-alert
                :show="!emailConfirm"
                variant="warning"
                class="mb-1"
              >
                <h4 class="alert-heading">
                  Your email is not confirmed. Please check your inbox.
                </h4>
              </b-alert>
              <!--/ alert -->
            </div>
          </b-col>
          <b-col
            md="4"
            class="d-none d-md-block sticky-top"
          >
            <div class="sticky-top">
              <h2
                class="mb-2"
              >
                <vuexy-logo />
              </h2>
              <h2>
                Let's Create a new Booking!
              </h2>
              <h4 class="mb-2">
                Choose the turf & facility first.
              </h4>
              <!-- image -->
              <b-img
                fluid
                class="p-4 mb-2"
                :src="require('@/assets/images/pages/error.svg')"
                alt="Create Profile Page"
              />
              <!-- alert -->
              <b-alert
                :show="!emailConfirm"
                variant="warning"
                class="mb-1"
              >
                <h4 class="alert-heading">
                  Your email is not confirmed. Please check your inbox.
                </h4>
              </b-alert>
              <!--/ alert -->
            </div>
          </b-col>
          <b-col
            sm="12"
            md="8"
          >
            <account-setting-information />
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BImg, BRow, BCol, BAlert,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
// eslint-disable-next-line import/extensions
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import AccountSettingInformation from './AccountSettingInformation.vue'
// import AccountSettingSocial from './AccountSettingSocial.vue'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BAlert,
    VuexyLogo,
    BRow,
    BCol,
    BImg,
    AccountSettingInformation,
    // AccountSettingSocial,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      emailConfirm: true,
      submitting: false,
    }
  },
  beforeMount() {
  },
  methods: {
  },
}
</script>
<style scoped>
.sticky-top { top: 5rem; }
.tab-content {
  max-width: 100%!important;
}
</style>
