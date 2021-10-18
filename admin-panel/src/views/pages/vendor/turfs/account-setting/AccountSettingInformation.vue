<template>
  <b-card v-if="!loading">
    <!-- form -->
    <b-form>
      <b-row>
        <!-- bio -->
        <b-col cols="12">
          <b-form-group
            label="About"
            label-for="about-area"
          >
            <b-form-textarea
              v-if="'about' in localOptions"
              id="about-area"
              v-model="localOptions.about"
              rows="4"
              placeholder="About turf here..."
            />
          </b-form-group>
        </b-col>
        <!--/ bio -->

        <!-- Country -->
        <b-col md="6">
          <b-form-group
            label-for="countryList"
            label="Country"
          >
            <v-select
              id="countryList"
              v-model="localOptions.country"
              disabled
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="title"
              :options="countryOption"
            />
          </b-form-group>
        </b-col>
        <!--/ Country -->

        <!-- State -->
        <b-col md="6">
          <b-form-group
            label-for="stateList"
            label="State"
          >
            <v-select
              id="stateList"
              v-model="localOptions.state"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="name"
              :options="states"
              @option:selected="$emit('update', localOptions);"
            />
          </b-form-group>
        </b-col>
        <!--/ State -->

        <!-- City -->
        <b-col md="6">
          <b-form-group
            label-for="cityList"
            label="City"
          >
            <v-select
              id="cityList"
              v-model="localOptions.city"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              label="name"
              :options="cities"
            />
          </b-form-group>
        </b-col>
        <!--/ City -->

        <!-- pin code -->
        <b-col md="6">
          <b-form-group
            label-for="pinCode"
            label="Pin Code"
          >
            <b-form-input
              id="pincode"
              v-model="localOptions.pincode"
              placeholder="Pin Code"
            />
          </b-form-group>
        </b-col>
        <!--/ pin code -->

        <!-- address -->
        <b-col md="12">
          <b-form-group
            label-for="address"
            label="Address"
          >
            <b-form-input
              id="website"
              v-model="localOptions.address"
              placeholder="Address"
            />
          </b-form-group>
        </b-col>
        <!--/ address -->

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-1 mr-1"
            @click="submitForm"
          >
            Save changes
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            type="reset"
            class="mt-1"
            variant="outline-secondary"
            @click.prevent="resetForm"
          >
            Reset
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
  <b-card v-else>
    <b-skeleton
      animation="throb"
      width="85%"
    />
    <b-skeleton
      animation="throb"
      width="55%"
    />
    <b-skeleton
      animation="throb"
      width="70%"
    />
  </b-card>
</template>

<script>
import {
  BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BCard, BFormTextarea,
} from 'bootstrap-vue'
import { State, City } from 'country-state-city'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'

// eslint-disable-next-line import/no-extraneous-dependencies
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BButton,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BFormTextarea,
    vSelect,
  },
  directives: {
    Ripple,
  },
  props: {
    informationData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loading: false,
      countryOption: ['India'],
      localOptions: {},
      state: '',
      city: '',
      clevePhone: {
        phone: true,
        phoneRegionCode: 'IN',
      },
    }
  },
  computed: {
    states() {
      if (this.localOptions.country === null || this.localOptions.country === '') {
        return []
      }
      return State.getStatesOfCountry('IN')
    },
    cities() {
      if (this.localOptions.state === null || this.localOptions.state === '') {
        return []
      }
      return City.getCitiesOfState('IN', this.localOptions.state.isoCode)
    },
  },
  created() {
    this.loading = true
    this.localOptions = JSON.parse(JSON.stringify(this.informationData))
    if (!('about' in this.localOptions)) {
      this.localOptions.about = ''
    }
    if (!('address' in this.localOptions)) {
      this.localOptions.address = ''
    }
    this.loading = false
  },
  methods: {
    resetForm() {
      this.localOptions = JSON.parse(JSON.stringify(this.informationData))
      if (!('about' in this.localOptions)) {
        this.localOptions.about = ''
      }
      if (!('address' in this.localOptions)) {
        this.localOptions.address = ''
      }
    },
    async updateTurfData(values) {
      /**
       *
       * update_turf(where: {id: {_eq: ""}}, _set: {}) {
          returning {
            id
            instagram
          }
        }
       *
       */
      this.loading = true
      await this.$apollo.mutate({
        mutation: gql`mutation ($id: bigint!, $about: String, $state: String, $city: String, $pincode: Int, $address: String) {
         update_turf(where: {id: {_eq: $id}}, _set: { about: $about, state: $state, city: $city, pincode: $pincode, address: $address }) {
            returning {
                id
            }
          }
        }`,
        variables: {
          id: values.id,
          about: values.about,
          state: values.state,
          city: values.city,
          pincode: values.pincode,
          address: values.address,
        },
        update: async cache => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query ($id: bigint!) {
                turf_by_pk(id: $id) {
                  facilities {
                    id
                    end_time
                    max_players
                    name
                    price
                    slot_size
                    start_time
                    status
                    type
                    weekendPrice
                    sport {
                      id
                      name
                      images {
                        url
                      }
                      disabled
                    }
                  }
                  about
                  address
                  city
                  id
                  name
                  pincode
                  state
                  status
                  ratings_aggregate {
                    aggregate {
                      avg {
                        ratings
                      }
                    }
                  }
                  contactEmail
                  contactName
                  contactPhone
                  gMapsBusinessLink
                  gMapsLat
                  gMapsLon
                }
              }`,
              variables: {
                id: values.id,
              },
            })
            data.turf_by_pk = {
              ...data.turf_by_pk,
              name: values.name,
              contactPhone: values.contactPhone,
              contactEmail: values.contactEmail,
              contactName: values.contactName,
            }
            await cache.writeQuery({
              query: gql`query ($id: bigint!) {
                turf_by_pk(id: $id) {
                  facilities {
                    id
                    end_time
                    max_players
                    name
                    price
                    slot_size
                    start_time
                    status
                    type
                    weekendPrice
                    sport {
                      id
                      name
                      images {
                        url
                      }
                      disabled
                    }
                  }
                  about
                  address
                  city
                  id
                  name
                  pincode
                  state
                  status
                  ratings_aggregate {
                    aggregate {
                      avg {
                        ratings
                      }
                    }
                  }
                  contactEmail
                  contactName
                  contactPhone
                  gMapsBusinessLink
                  gMapsLat
                  gMapsLon
                }
              }`,
              variables: {
                id: values.id,
              },
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Updated Turf successfully!',
                variant: 'success',
              },
            })
          } catch (e) {
            if (e.message.includes('Can\'t find field turf_by_pk')) {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Success',
                  icon: 'CheckIcon',
                  text: 'Updated Turf successfully!',
                  variant: 'success',
                },
              })
              window.location.reload()
            } else {
              this.$toast({
                component: ToastificationContent,
                props: {
                  title: 'Error updating turf',
                  icon: 'XCircleIcon',
                  text: e,
                  variant: 'danger',
                },
              })
            }
          }
        },
      }).catch(e => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error updating turf',
            icon: 'XCircleIcon',
            text: e,
            variant: 'danger',
          },
        })
        this.$router.go(-1)
      })
      this.loading = false
    },
    async submitForm() {
      if (this.localOptions.about !== this.informationData.about || this.localOptions.address !== this.informationData.address || this.localOptions.state !== this.informationData.state || this.localOptions.city !== this.informationData.city || this.localOptions.pincode !== this.informationData.pincode) {
        const data = {
          id: this.informationData.id,
          about: this.localOptions.about || null,
          state: 'name' in this.localOptions.state ? this.localOptions.state.name : this.localOptions.state,
          city: 'name' in this.localOptions.city ? this.localOptions.city.name : this.localOptions.city,
          pincode: this.localOptions.pincode,
          address: this.localOptions.address || null,
        }
        await this.updateTurfData(data)
        this.$emit('update', data)
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
