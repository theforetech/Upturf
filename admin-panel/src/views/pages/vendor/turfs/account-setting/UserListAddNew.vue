<template>
  <b-sidebar
    id="add-new-turf-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-turf-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Facility
        </h5>

        <feather-icon
          class="ml-1 cursor-pointer"
          icon="XIcon"
          size="16"
          @click="hide"
        />

      </div>

      <!-- BODY -->
      <validation-observer
        #default="{ handleSubmit }"
        ref="refFormObserver"
      >
        <!-- Form -->
        <b-form
          class="p-2"
          @submit.prevent="handleSubmit(submit)"
          @reset.prevent="resetForm"
        >

          <!-- Sport -->
          <validation-provider
            #default="validationContext"
            name="Sport"
            rules="required"
          >
            <b-form-group
              label="Sport"
              label-for="sport"
            >
              <b-form-select
                id="type"
                v-model="sport"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Choose Sport"
                :options="sports"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Name -->
          <validation-provider
            #default="validationContext"
            name="Type"
            rules="required"
          >
            <b-form-group
              label="Type"
              label-for="type"
            >
              <b-form-input
                id="type"
                v-model="type"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="1v1 or 2v2 etc."
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Max Players -->
          <validation-provider
            #default="validationContext"
            name="Max Players"
            rules="required|integer"
          >
            <b-form-group
              label="Max Players"
              label-for="Max Players"
            >
              <b-form-input
                id="maxPlayers"
                v-model="maxPlayers"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Number of players allowed"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Price -->
          <validation-provider
            #default="validationContext"
            name="Price"
            rules="required|integer"
          >
            <b-form-group
              label="Price"
              label-for="Price"
            >
              <b-input-group
                label="Price"
                label-for="Price"
              >
                <b-input-group-prepend is-text>
                  <img
                    src="/images/rupee.svg"
                    style="width: 12px"
                  >
                </b-input-group-prepend>
                <b-form-input
                  id="weeekdayPrice"
                  v-model="price"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Weekday Price"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-input-group>
            </b-form-group>
          </validation-provider>

          <!-- Weekend Price -->
          <validation-provider
            #default="validationContext"
            name="Weekend Price"
            rules="required|integer"
          >
            <b-form-group
              label="Weekend Price"
              label-for="Weekend Price"
            >
              <b-input-group
                label="Weekend Price"
                label-for="Weekend Price"
              >
                <b-input-group-prepend is-text>
                  <img
                    src="/images/rupee.svg"
                    style="width: 12px"
                  >
                </b-input-group-prepend>
                <b-form-input
                  id="weekendPrice"
                  v-model="weekendPrice"
                  autofocus
                  :state="getValidationState(validationContext)"
                  trim
                  placeholder="Weekend Price"
                />

                <b-form-invalid-feedback>
                  {{ validationContext.errors[0] }}
                </b-form-invalid-feedback>
              </b-input-group>
            </b-form-group>
          </validation-provider>

          <!-- Slot Size -->
          <validation-provider
            #default="validationContext"
            name="Slot Size"
            rules="required"
          >
            <b-form-group
              label="Slot Size"
              label-for="Slot Size"
            >
              <b-form-select
                id="slotSize"
                v-model="slot_size"
                autofocus
                :options="slots"
                :state="getValidationState(validationContext)"
                trim
                placeholder="Slot Size (time in minutes) eg. 30/60/90/120"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Start Time -->
          <validation-provider
            #default="validationContext"
            name="Start Time"
            rules="required"
          >
            <b-form-group
              label="Start Time"
              label-for="Start Time"
            >
              <b-form-timepicker
                id="start_time"
                v-model="start_time"
                class="mb-2"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Time when first slot starts"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- End Time -->
          <validation-provider
            #default="validationContext"
            name="End Time"
            rules="required"
          >
            <b-form-group
              label="End Time"
              label-for="End Time"
            >
              <b-form-timepicker
                id="end_time"
                v-model="end_time"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Time when last slot ends"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Form Actions -->
          <div class="d-flex mt-2">
            <b-button
              v-ripple.400="'rgba(255, 255, 255, 0.15)'"
              variant="primary"
              class="mr-2"
              type="submit"
            >
              Add
            </b-button>
            <b-button
              v-ripple.400="'rgba(186, 191, 199, 0.15)'"
              type="button"
              variant="outline-secondary"
              @click="hide"
            >
              Cancel
            </b-button>
          </div>

        </b-form>
      </validation-observer>
    </template>
  </b-sidebar>
</template>

<script>
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton, BFormTimepicker, BFormSelect, BInputGroupPrepend, BInputGroup,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import {
  required, alphaNum, email, integer,
} from '@validations'
import formValidation from '@core/comp-functions/forms/form-validation'
import Ripple from 'vue-ripple-directive'
import countries from '@/@fake-db/data/other/countries'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BSidebar,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BButton,
    BFormTimepicker,
    BFormSelect,
    BInputGroup,
    BInputGroupPrepend,

    // Form Validation
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  model: {
    prop: 'isAddNewUserSidebarActive',
    event: 'update:is-add-new-turf-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
    turfID: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sports: [{ value: null, text: 'Choose Sport' }],
      slots: [{ value: null, text: 'Choose Slot Size (time in minutes)' }, { value: 30, text: '30 minutes' }, { value: 60, text: '60 minutes' }, { value: 90, text: '90 minutes' }, { value: 120, text: '120 minutes' }],
      required,
      alphaNum,
      integer,
      email,
      countries,
      sport: null,
      type: '',
      maxPlayers: '',
      price: '',
      weekendPrice: '',
      slot_size: null,
      start_time: '',
      end_time: '',
    }
  },
  beforeDestroy() {
    this.$emit('destroy-done')
  },
  beforeMount() {
    this.getSports()
  },
  methods: {
    reset() {
      this.sport = null
      this.type = ''
      this.maxPlayers = ''
      this.price = ''
      this.weekendPrice = ''
      this.slot_size = null
      this.start_time = ''
      this.end_time = ''
    },
    async submit() {
      await this.$apollo.mutate({
        mutation: gql`mutation test($price: Int!, $turf_id: bigint!, $sport_id: Int!, $type: String, $slot_size: Int, $start_time: time, $end_time: time, $weekendPrice: Int, $max_players: Int!) {
          insert_facilities_one(object: {price: $price, end_time: $end_time, max_players: $max_players, slot_size: $slot_size, sport_id: $sport_id, start_time: $start_time, turf_id: $turf_id, type: $type, weekendPrice: $weekendPrice}) {
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
        }`,
        variables: {
          turf_id: this.turfID,
          sport_id: this.sport,
          type: this.type,
          max_players: this.maxPlayers,
          price: this.price,
          weekendPrice: this.weekendPrice,
          slot_size: this.slot_size,
          start_time: this.start_time,
          end_time: this.end_time,
        },
        update: async (cache, { data: { insert_facilities_one } }) => {
          // Read the data from our cache for this query.
          try {
            // eslint-disable-next-line no-unused-vars
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
                id: this.turfID,
              },
            })
            if (!('facilities' in data)) {
              data.facilities = []
            }
            data.facilities.push(insert_facilities_one)
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
                id: this.turfID,
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
            this.$emit('update', true)
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
            title: 'Error adding turf',
            icon: 'XCircleIcon',
            text: e,
            variant: 'danger',
          },
        })
      })
      this.reset()
      this.isAddNewUserSidebarActive = false
    },
    async getSports() {
      const result = await this.$apollo.query({
        query: gql`query {
          sport {
            disabled
            id
            name
            images {
                url
            }
          }
        }`,
      })
      let sports = result.data.sport.map(sport => ({
        value: sport.id,
        disabled: sport.disabled,
        text: sport.name.charAt(0).toUpperCase() + sport.name.slice(1),
      }))
      sports = sports.filter(sport => !sport.disabled)
      this.sports = [
        ...this.sports,
        ...sports,
      ]
    },
  },
  setup() {
    const blankUserData = {
      fullName: '',
      username: '',
      email: '',
      role: null,
      currentPlan: null,
      company: '',
      country: '',
      contact: '',
    }

    const userInfo = ref(JSON.parse(JSON.stringify(blankUserData)))
    const resetuserData = () => {
      userInfo.value = JSON.parse(JSON.stringify(blankUserData))
    }

    // const onSubmit = () => {
    //   store.dispatch('app-turf/addUser', userInfo.value)
    //     .then(() => {
    //       emit('refetch-data')
    //       emit('update:is-add-new-turf-sidebar-active', false)
    //     })
    // }

    const {
      refFormObserver,
      getValidationState,
      resetForm,
    } = formValidation(resetuserData)

    return {
      userInfo,
      // onSubmit,

      refFormObserver,
      getValidationState,
      resetForm,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-turf-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
