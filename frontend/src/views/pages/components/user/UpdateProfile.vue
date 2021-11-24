<template>
  <div>
    <b-card
      no-body
    >
      <b-card-header style="padding-left:0.5rem;padding-right: 0;">
        <b-row style="width: 100%;margin: 0;">
          <b-col
            cols="3"
            align-self="center"
          >
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
          </b-col>
          <b-col
            cols="6"
            style="padding: 0"
            align-self="center"
          >
            <h2 style="text-align:center;font-size: 1.2rem;font-weight: 600;color:#000;white-space: nowrap;">
              Update Profile Info
            </h2>
          </b-col>
        </b-row>
      </b-card-header>
    </b-card>
    <b-card>
      <b-card-body>
        <b-row>
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
                        autocomplete="off"
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
                    Update Profile
                  </b-button>
                </b-form>
              </validation-observer>
            </b-col>
          </b-col>
        </b-row>

      </b-card-body>
    </b-card>

  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import Ripple from 'vue-ripple-directive'
import {
  BRow, BCol, BButton, VBTooltip, BForm, BFormGroup, BFormInput, BInputGroupPrepend, BInputGroup, BCardHeader, BCardBody, BCard,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import Cleave from 'vue-cleave-component'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.in'
import gql from 'graphql-tag'
// import moment from 'moment'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { mapGetters } from 'vuex'
import store from '@/store/index'

export default {
  components: {
    BInputGroupPrepend,
    Cleave,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BButton,
    BForm,
    // BCardTitle,
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties,global-require
      sideImg: require('@/assets/images/pages/register-v2.svg'),
      // validation
      required,
      email,
      profile: [],
      userID: '',
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties,global-require
        this.sideImg = require('@/assets/images/pages/register-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
    ...mapGetters({
      userProfile: 'user/getUserProfile',
    }),
  },
  mounted() {
    this.userID = this.$auth.user['https://hasura.io/jwt/claims']['x-hasura-user-id']
    this.name = this.userProfile[0].name
    this.phone = this.userProfile[0].phone_number
    this.vm.searchPlace = this.userProfile[0].locName
  },
  methods: {
    navigateBack() {
      this.$router.go(-1)
    },
    register() {
      this.$refs.registerForm.validate().then(async success => {
        if (success) {
          let city = ''
          this.vm.location.address_components.forEach(comp => {
            if (comp.types.includes('administrative_area_level_2')) {
              city = comp.long_name
            }
          })
          const vars = {}
          vars.name = this.name
          vars.phone = this.phone
          vars.locName = this.vm.searchPlace
          vars.lat = this.vm.location.geometry.location.lat()
          vars.lon = this.vm.location.geometry.location.lng()
          vars.city = city

          const res = await this.$apollo.mutate({
            mutation: gql`mutation ($userid: String!,$name: String, $phone: String, $lat: float8, $lon: float8, $locName: String, $city: String) {
              update_user_profile_by_pk(pk_columns: {user_id: $userid},_set: { name: $name, phone_number: $phone, lat: $lat, lon: $lon, default_city: $city, locName: $locName }) {
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
              userid: this.userID,
              ...vars,
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
            if (res === undefined || !('data' in res) || !('update_user_profile_by_pk' in res.data) || !res.data.update_user_profile_by_pk) {
              return
            }
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Profile Updated!',
                icon: 'CheckIcon',
                text: 'Let\'s get started.',
                variant: 'success',
              },
            },
            {
              timeout: 4000,
            })
            await this.$store.commit('user/UPDATE_USER_PROFILE', res.data.update_user_profile_by_pk)
            this.$router.go(-1)
          } catch (e) {
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
<style scoped>
h2{
  font-size: 0.8rem;
}
.back{
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
  font-size: 1.3rem;
  font-weight: bolder;
  padding-left:0.6rem ;
  padding-right:0rem ;
}
.checkout{
  width: 100%;
  line-height: 1.8;
}
.checkout h2:nth-child(1){
  float: left;
}
.checkout h2:nth-child(2){
  position:absolute;
  right:0;
}
.details h2{
  line-height: 1.4;
  font-size: 1.1rem;

}

.internal .card-body{
  padding-top: 0;
  padding-bottom: 0;
}
.summary .card-body{
  padding-bottom: 0;
}
.summaryCard{
  margin-bottom: 1rem;
}
[dir] .summary .card-body[data-v-2f3ae0e8] {
  padding: 0;
}
</style>
