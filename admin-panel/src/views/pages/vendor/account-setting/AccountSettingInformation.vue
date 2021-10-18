<template>
  <b-card>
    <!-- form -->
    <validation-observer ref="form2">
      <b-form>
        <b-row>
          <!-- bio -->
          <b-col cols="12">
            <b-form-group
              label="About"
              label-for="bio-area"
            >
              <b-form-textarea
                id="bio-area"
                v-model="localOptions.bio"
                rows="4"
                :disabled="disabled"
                placeholder="About you..."
                @change="$emit('update', localOptions);"
              />
            </b-form-group>
          </b-col>
          <!--/ bio -->

          <!-- birth date -->
          <b-col md="6">
            <b-form-group
              label-for="example-datepicker"
              label="Birth date"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="Birth Date"
              >
                <flat-pickr
                  v-model="localOptions.dob"
                  class="form-control"
                  name="date"
                  placeholder="Birth date"
                  :disabled="disabled"
                  :config="flatPickrOptions"
                  @on-change="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ birth date -->

          <!-- phone -->
          <b-col md="6">
            <b-form-group
              label-for="phone"
              label="Phone"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="Phone number"
              >
                <cleave
                  id="phone"
                  v-model="localOptions.phone"
                  class="form-control"
                  :raw="false"
                  :state="errors.length > 0 ? false:null"
                  :options="clevePhone"
                  :disabled="disabled"
                  placeholder="Phone number"
                  @change="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!-- phone -->

          <!-- website -->
          <b-col md="6">
            <b-form-group
              label-for="website"
              label="Website"
            >
              <validation-provider
                #default="{ errors }"
                rules="url"
                name="Website"
              >
                <b-form-input
                  id="website"
                  v-model="localOptions.website"
                  :state="errors.length > 0 ? false:null"
                  :disabled="disabled"
                  placeholder="Website address"
                  @keyup="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ website -->

          <!-- Country -->
          <b-col md="6">
            <b-form-group
              label-for="countryList"
              label="Country"
            >
              <v-select
                id="countryList"
                v-model="localOptions.country"
                :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                label="title"
                disabled
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
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="State"
              >
                <v-select
                  id="stateList"
                  v-model="localOptions.state"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="name"
                  :state="errors.length > 0 ? false:null"
                  :options="states"
                  :disabled="disabled"
                  @option:selected="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ State -->

          <!-- City -->
          <b-col md="6">
            <b-form-group
              label-for="cityList"
              label="City"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="City"
              >
                <v-select
                  id="cityList"
                  v-model="localOptions.city"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  label="name"
                  :disabled="disabled || localOptions.state === ''"
                  :options="cities"
                  :state="errors.length > 0 ? false:null"
                  @option:selected="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <!--/ City -->

          <!-- address -->
          <b-col md="12">
            <b-form-group
              label-for="address"
              label="Address"
            >
              <label>This field is required</label>
              <validation-provider
                #default="{ errors }"
                rules="required"
                name="Address"
              >
                <b-form-input
                  id="address"
                  v-model="localOptions.address"
                  :disabled="disabled"
                  placeholder="Address"
                  :state="errors.length > 0 ? false:null"
                  @keyup="$emit('update', localOptions);"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
        <!--/ address -->
        </b-row>
      </b-form>
    </validation-observer>
  </b-card>
</template>

<script>
import {
  BForm, BFormGroup, BFormInput, BRow, BCol, BCard, BFormTextarea,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import Cleave from 'vue-cleave-component'

import { ValidationProvider, ValidationObserver } from 'vee-validate'
// import {
//   required, email, confirmed, url, between, alpha, integer, password, min, digits, alphaDash, length,
// } from '@validations'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'cleave.js/dist/addons/cleave-phone.us'
import { State, City } from 'country-state-city'
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

let minDate = new Date()
minDate = minDate.setFullYear(minDate.getFullYear() - 18)
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ValidationProvider,
    ValidationObserver,
    BForm,
    BFormGroup,
    BFormInput,
    BRow,
    BCol,
    BCard,
    BFormTextarea,
    vSelect,
    flatPickr,
    Cleave,
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
      disabled: false,
      countryOption: ['India'],
      localOptions: JSON.parse(JSON.stringify(this.informationData)),
      clevePhone: {
        phone: true,
        phoneRegionCode: 'IN',
      },
      flatPickrOptions: {
        maxDate: minDate,
      },
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
    states() {
      if (this.localOptions.country === null || this.localOptions.country === '') {
        return []
      }
      console.log(City)
      return State.getStatesOfCountry('IN')
    },
    cities() {
      if (this.localOptions.state === null || this.localOptions.state === '') {
        return []
      }
      return City.getCitiesOfState('IN', this.localOptions.state.isoCode)
    },
  },
  methods: {
    enableForm() {
      this.disabled = false
    },
    disableForm() {
      this.disabled = true
    },
    resetForm() {
      this.disabled = false
      this.localOptions = JSON.parse(JSON.stringify(this.informationData))
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
