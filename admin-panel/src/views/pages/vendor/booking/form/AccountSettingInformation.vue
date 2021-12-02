<template>
  <b-card>
    <!-- form -->
    <validation-observer ref="form2">
      <b-form>
        <b-row>
          <!-- Country -->
          <b-col md="12">
            <b-form-group
              label-for="turfList"
              label="Turf"
            >
              <v-select
                id="turfList"
                v-model="turf"
                label="name"
                code="id"
                :options="turfs"
              />
            </b-form-group>
          </b-col>
          <!--/ Country -->

          <!-- Country -->
          <b-col md="12">
            <b-form-group
              label-for="facilityList"
              label="Facility"
            >
              <v-select
                id="facilityList"
                v-model="facility"
                label="type"
                code="id"
                :disabled="turf === null"
                :options="facilityList"
              />
            </b-form-group>
          </b-col>
          <!--/ Country -->

          <b-col md="6">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mt-2 mr-1"
              :disabled="turf === null || facility === null"
              @click="bookFacility"
            >
              Lookup Slots
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
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BForm, BFormGroup, BRow, BCol, BCard, BButton,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
// import {
//   required, email, confirmed, url, between, alpha, integer, password, min, digits, alphaDash, length,
// } from '@validations'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.us'
import {
  alpha, alphaDash,
  between,
  confirmed, digits,
  email,
  integer, length,
  min,
  password,
  required,
  url,
} from '@core/utils/validations/validations'
import { codeType } from '@/views/forms/form-validation/code'
import gql from 'graphql-tag'

let minDate = new Date()
minDate = minDate.setFullYear(minDate.getFullYear() - 18)
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ValidationProvider,
    ValidationObserver,
    BButton,
    BForm,
    BFormGroup,
    BRow,
    BCol,
    BCard,
    vSelect,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      turfs: [],
      disabled: false,
      countryOption: ['India'],
      clevePhone: {
        phone: true,
        phoneRegionCode: 'IN',
      },
      flatPickrOptions: {
        maxDate: minDate,
      },
      facility: null,
      turf: null,
      required,
      confirmed,
      password,
      email,
      min,
      integer,
      url,
      alpha,
      between,
      digits,
      length,
      alphaDash,
      codeType,
    }
  },
  computed: {
    facilityList() {
      if (this.turf === null) {
        return []
      }
      return this.turf.facilities.map(facility => ({
        id: facility.id,
        type: `${facility.sport.name.toUpperCase()} - ${facility.type}`,
      }))
    },
    turfList() {
      if (this.turfs === null) {
        return []
      }
      return []
      // return this.turfs.map(turf => ({
      //   key: turf.id,
      //   value: turf.name,
      // }))
    },
  },
  mounted() {
    this.getTurfs()
  },
  methods: {
    async getTurfs() {
      const result = await this.$apollo.query({
        query: gql`query {
          turf {
            id
            name
            facilities {
                id
                type
                sport {
                    name
                }
            }
            status
          }
        }`,
        fetchPolicy: 'no-cache',
      })
      this.turfs = result.data.turf
    },
    enableForm() {
      this.disabled = false
    },
    disableForm() {
      this.disabled = true
    },
    resetForm() {
      this.disabled = false
      this.turf = null
      this.facility = null
    },
    bookFacility() {
      this.$router.push({
        name: 'vendor-new-booking',
        params: {
          facility: this.facility.id,
          turf: this.turf.id,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
