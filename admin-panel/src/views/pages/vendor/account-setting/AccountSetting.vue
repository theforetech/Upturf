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
                Let's Get Started!
              </h2>
              <h4 class="mb-2">
                First, We would like to know a bit about you.
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
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mt-2 mr-1"
              >
                Create Profile
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="outline-secondary"
                type="reset"
                class="mt-2 mr-1"
                @click.prevent="resetForm"
              >
                Reset
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="outline-secondary"
                class="mt-2"
                @click.prevent="logOut"
              >
                Logout
              </b-button>
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
                <!--          <h2 class="brand-text text-primary ml-1">-->
                <!--            Surf A Turf-->
                <!--          </h2>-->
              </h2>
              <h2>
                Let's Get Started!
              </h2>
              <h4 class="mb-2">
                First, We would like to know a bit about you.
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
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                class="mt-2 mr-1"
                :disabled="!emailConfirm"
                @click="submitForm"
              >
                Create Profile
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                class="mt-2 mr-1"
                @click="resetForm"
              >
                Reset
              </b-button>
              <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                variant="outline-secondary"
                class="mt-2"
                @click.prevent="logOut"
              >
                Logout
              </b-button>
            </div>
          </b-col>
          <b-col
            sm="12"
            md="8"
          >
            <account-setting-general
              v-if="formData.general"
              ref="accountGeneral"
              :general-data="formData.general"
              @update="formData.general = $event;"
            />
            <account-setting-information
              v-if="formData.info"
              ref="accountInformation"
              :information-data="formData.info"
              @update="formData.info = $event;"
            />
            <!--            <account-setting-social-->
            <!--              v-if="formData.social"-->
            <!--              :social-data="formData.social"-->
            <!--              @update="formData.social = $event;"-->
            <!--            />-->
          </b-col>
        </b-row>

      </div>
    </div>
  </div>
</template>

<script>
import {
  BImg, BRow, BCol, BButton, BAlert,
} from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
// eslint-disable-next-line import/extensions
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import AccountSettingGeneral from './AccountSettingGeneral.vue'
import AccountSettingInformation from './AccountSettingInformation.vue'
// import AccountSettingSocial from './AccountSettingSocial.vue'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BButton,
    BAlert,
    VuexyLogo,
    BRow,
    BCol,
    BImg,
    AccountSettingGeneral,
    AccountSettingInformation,
    // AccountSettingSocial,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      formData: {
        general: {
          avatar: '/img/avatar-s-11.14cf1734.jpg', username: 'johndoe', fullName: '', email: '', company: '',
        },
        info: {
          bio: '', dob: null, country: 'India', state: '', city: '', address: '', website: '', phone: null,
        },
        social: {
          connections: {
            twitter: { profileImg: '/img/11-small.4ade0856.png', id: 'johndoe' }, google: { profileImg: '/img/3-small.33d29f56.png', id: 'luraweber' }, facebook: {}, github: {},
          },
        },
      },
      emailConfirm: true,
    }
  },
  beforeMount() {
    this.formData.general.username = this.$store.state.user.AppActiveUser.uid
    this.formData.general.email = this.$store.state.user.AppActiveUser.email || null
    if (this.$store.state.user.AppActiveUser.emailVerified !== undefined && !this.$store.state.user.AppActiveUser.emailVerified) {
      this.emailConfirm = false
    }
  },
  methods: {
    async submitForm() {
      // console.log(this.$refs)
      // console.log(this.$refs.accountInformation)
      const form1 = await this.$refs.accountGeneral.$refs.form1.validate()
      const form2 = await this.$refs.accountInformation.$refs.form2.validate()
      if (form1 && form2) {
        alert('SUBMIT')
        await this.$apollo.mutate({
          mutation: gql`mutation test($name: String!, $address: String!, $phone_number: String!, $birthDate: date!, $company: String!, $city: String!, $country: String!, $state: String!, $about: String, $website: String) {
          insert_vendor_one(object: {address: $address, name: $name, phone_number: $phone_number, birthDate: $birthDate, about: $about, city: $city, company: $company, country: $country, state: $state, website: $website}) {
            about
            address
            city
            company
            country
            name
            payment_details
            phone_number
            state
            website
          }
        }`,
          variables: {
            name: this.formData.general.fullName,
            company: this.formData.general.company,
            about: this.formData.info.bio,
            country: this.formData.info.country,
            birthDate: this.formData.info.dob,
            state: this.formData.info.state,
            city: this.formData.info.city,
            address: this.formData.info.address,
            website: this.formData.info.website,
            phone_number: this.formData.info.phone,
          },
          update: async (cache, { data: { insert_vendor_one } }) => {
            // Read the data from our cache for this query.
            try {
              console.log(insert_vendor_one)
              const data = await cache.readQuery({
                query: gql`query {
                    vendor {
                        about
                        address
                        city
                        company
                        country
                        name
                        payment_details
                        phone_number
                        state
                        website
                    }
                }`,
              })
              console.log(data)
              data.vendor.splice(0, 0, insert_vendor_one)
              await cache.writeQuery({
                query: gql`query {
                    vendor {
                        about
                        address
                        city
                        company
                        country
                        name
                        payment_details
                        phone_number
                        state
                        website
                    }
                }`,
                data,
              })
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Created Profile successfully!',
                  variant: 'success',
                },
              })
              // Redirect
            } catch (e) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Error updating profile',
                  icon: 'XCircleIcon',
                  text: e,
                  variant: 'danger',
                },
              })
            }
          },
        })
      }
    },
    logOut() {
      this.$auth.logOut()
    },
    resetForm() {
      this.formData = {
        general: {
          avatar: '/img/avatar-s-11.14cf1734.jpg', username: 'johndoe', fullName: '', email: '', company: '',
        },
        info: {
          bio: '', dob: null, country: 'India', state: '', city: '', address: '', website: '', phone: null,
        },
        social: {
          connections: {
            twitter: { profileImg: '/img/11-small.4ade0856.png', id: 'johndoe' }, google: { profileImg: '/img/3-small.33d29f56.png', id: 'luraweber' }, facebook: {}, github: {},
          },
        },
      }
      this.formData.general.username = this.$store.state.user.AppActiveUser.uid
      this.formData.general.email = this.$store.state.user.AppActiveUser.email || null
      this.$refs.accountInformation.resetForm()
      this.$refs.accountGeneral.resetForm()
    },
  },
}
</script>
<style scoped>
.sticky-top { top: 5rem; }
.tab-content {
  max-width: 100%!important;
}
</style>
