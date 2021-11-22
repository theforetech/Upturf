<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <Vuexy-logo />
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Register V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Register-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title class="mb-1">
            Adventure starts here 🚀
          </b-card-title>

          <!-- form -->
          <validation-observer
            ref="registerForm"
            #default="{invalid}"
          >
            <b-form
              class="auth-register-form mt-2"
              @submit.prevent="register"
            >
              <!-- username -->
              <b-form-group
                label="Name"
                label-for="register-username"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Name"
                  vid="name"
                  rules="required"
                >
                  <b-form-input
                    id="register-name"
                    v-model="name"
                    name="register-name"
                    :state="errors.length > 0 ? false:null"
                    placeholder="John Doe"
                  />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- email -->
              <b-form-group
                label="Phone Number"
                label-for="phone"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Phone"
                  vid="phone"
                  rules="required"
                >
                  <b-input-group>
                    <b-input-group-prepend is-text>
                      IN (+91)
                    </b-input-group-prepend>
                    <cleave
                      id="phone"
                      v-model="phone"
                      class="form-control"
                      :raw="false"
                      :options="phoneOptions"
                      placeholder="77991 44423"
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                v-b-tooltip.hover.right="'Search and select Location below! This doesn\'t need to be a full address.'"
                label-for="vi-search-bar"
                class="searchBar"
                label="Default Location (for nearby Turfs)"
              >
                <validation-provider
                  #default="{ errors }"
                  name="Search"
                  vid="search"
                  rules="required"
                >
                  <b-input-group
                    class="input-group-merge searchInput"
                  >
                    <b-form-input
                      id="vi-location"
                      v-model="vm.location.name"
                      placeholder="Your location will display here on selection"
                      class="searchInput field"
                      name="name"
                      :disabled="true"
                    />
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <b-form-group
                label-for="vi-search-bar"
                class="searchBar"
              >
                <b-input-group class="input-group-merge searchInput">
                  <b-input-group-prepend is-text>
                    <feather-icon
                      icon="SearchIcon"
                      class="searchIcon"
                    />
                  </b-input-group-prepend>
                  <b-form-input
                    id="vi-location"
                    v-model="vm.searchPlace"
                    v-gmaps-searchbox:location.name.geometry.address_components="vm"
                    placeholder="Search your location..."
                    class="searchInput field"
                    name="name"
                  />
                </b-input-group>
              </b-form-group>

              <b-button
                variant="primary"
                block
                type="submit"
                :disabled="invalid"
                @click="register"
              >
                Create Profile
              </b-button>
            </b-form>
          </validation-observer>
        </b-col>
      </b-col>
    <!-- /Register-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
import {
  BRow, BCol, BLink, BButton, VBTooltip, BForm, BFormGroup, BFormInput, BInputGroupPrepend, BImg, BCardTitle, BInputGroup,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.in'
import gql from 'graphql-tag'
// import moment from 'moment'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import store from '@/store/index'

export default {
  components: {
    BInputGroupPrepend,
    VuexyLogo,
    Cleave,
    BRow,
    BImg,
    BCol,
    BLink,
    BButton,
    BForm,
    BCardTitle,
    BFormGroup,
    BFormInput,
    BInputGroup,
    // validations
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    'b-tooltip': VBTooltip,
    Ripple,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      vm: {
        searchPlace: '',
        location: {},
      },
      phoneOptions: { phone: true, phoneRegionCode: 'IN' },
      status: '',
      name: '',
      phone: null,
      sideImg: require('@/assets/images/pages/register-v2.svg'),
      // validation
      required,
      email,
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    register() {
      this.$refs.registerForm.validate().then(async success => {
        if (success) {
          const lat = this.vm.location.geometry.location.lat()
          const lon = this.vm.location.geometry.location.lng()
          const locName = this.vm.location.name
          let city = ''
          this.vm.location.address_components.forEach(comp => {
            if (comp.types.includes('administrative_area_level_2')) {
              city = comp.long_name
            }
          })
          const res = await this.$apollo.mutate({
            mutation: gql`mutation ($name: String!, $phone: String!, $lat: float8!, $lon: float8!, $locName: String, $defaultCity: String) {
              insert_user_profile_one(object: { name: $name, phone_number: $phone, lat: $lat, lon: $lon, default_city: $defaultCity, locName: $locName }) {
                default_city
                lat
                locName
                lon
                name
                phone_number
                wishlists {
                  turf_id
                }
              }
            }`,
            variables: {
              name: this.name,
              phone: this.phone,
              defaultCity: city,
              lat,
              lon,
              locName,
            },
          }).catch(e => {
            const msg = e.message
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error Updating Profile',
                icon: 'XCircleIcon',
                text: msg,
                variant: 'danger',
              },
            })
          })
          try {
            if (res === undefined || !('data' in res) || !('insert_user_profile_one' in res.data) || !res.data.insert_user_profile_one) {
              return
            }
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Profile Created!',
                icon: 'CheckIcon',
                text: 'Let\'s get started.',
                variant: 'success',
              },
            },
            {
              timeout: 4000,
            })
            await this.$store.commit('user/UPDATE_USER_PROFILE', res.data.insert_user_profile_one)
            this.$router.push('/')
          } catch (e) {
            const msg = e.message
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error Creating Profile',
                icon: 'XCircleIcon',
                text: msg,
                variant: 'danger',
              },
            })
          }
        }
      })
    },
  },
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
