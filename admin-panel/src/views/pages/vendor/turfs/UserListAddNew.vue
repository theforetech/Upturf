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
          Add New Turf
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

          <!-- Name -->
          <validation-provider
            #default="validationContext"
            name="Name"
            rules="required"
          >
            <b-form-group
              label="Name"
              label-for="name"
            >
              <b-form-input
                id="name"
                v-model="name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Turf Name"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- City -->
          <!--          <validation-provider-->
          <!--            #default="validationContext"-->
          <!--            name="Location"-->
          <!--            rules="required"-->
          <!--          >-->
          <!--            <b-form-group-->
          <!--              label="Location"-->
          <!--              label-for="location"-->
          <!--            >-->
          <!--              &lt;!&ndash;              <b-form-input&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-model="vm.searchPlace"&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-gmaps-searchbox="vm"&ndash;&gt;-->
          <!--              &lt;!&ndash;                placeholder="Search For Business"&ndash;&gt;-->
          <!--              &lt;!&ndash;                name="name"&ndash;&gt;-->
          <!--              &lt;!&ndash;                autocomplete="off"&ndash;&gt;-->
          <!--              &lt;!&ndash;              />&ndash;&gt;-->
          <!--              &lt;!&ndash;              <b-form-input&ndash;&gt;-->
          <!--              &lt;!&ndash;                id="location"&ndash;&gt;-->
          <!--              &lt;!&ndash;                v-model="vm.location.name"&ndash;&gt;-->
          <!--              &lt;!&ndash;                autofocus&ndash;&gt;-->
          <!--              &lt;!&ndash;                :state="getValidationState(validationContext)"&ndash;&gt;-->
          <!--              &lt;!&ndash;                trim&ndash;&gt;-->
          <!--              &lt;!&ndash;                placeholder="Your location will display here on selection"&ndash;&gt;-->
          <!--              &lt;!&ndash;                class="searchInput field"&ndash;&gt;-->
          <!--              &lt;!&ndash;                name="name"&ndash;&gt;-->
          <!--              &lt;!&ndash;                :disabled="true"&ndash;&gt;-->
          <!--              &lt;!&ndash;              />&ndash;&gt;-->

          <!--              <b-form-invalid-feedback>-->
          <!--                {{ validationContext.errors[0] }}-->
          <!--              </b-form-invalid-feedback>-->
          <!--            </b-form-group>-->
          <!--          </validation-provider>-->
          <!--          <b-form-group-->
          <!--            label="Search Location"-->
          <!--            label-for="search-location"-->
          <!--          />-->

          <!-- Pincode -->
          <validation-provider
            #default="validationContext"
            name="City"
            rules="required"
          >
            <b-form-group
              label="City"
              label-for="city"
            >
              <b-form-input
                id="city"
                v-model="city"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="New Delhi"
              />

              <b-form-invalid-feedback>
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>
            </b-form-group>
          </validation-provider>

          <!-- Pincode -->
          <validation-provider
            #default="validationContext"
            name="Pincode"
            rules="required"
          >
            <b-form-group
              label="Pincode"
              label-for="pincode"
            >
              <b-form-input
                id="pincode"
                v-model="pincode"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="560001"
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
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { ref } from '@vue/composition-api'
import { required, alphaNum, email } from '@validations'
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
    roleOptions: {
      type: Array,
      required: true,
    },
    planOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      currentPlace: null,
      locationSelected: false,
      vm: {
        searchPlace: '',
        location: {},
      },
      required,
      alphaNum,
      email,
      countries,
      name: '',
      pincode: '',
      city: '',
    }
  },
  beforeDestroy() {
    this.$emit('destroy-done')
  },
  methods: {
    reset() {
      this.name = ''
      this.pincode = ''
      this.city = ''
    },
    async submit() {
      await this.$apollo.mutate({
        mutation: gql`mutation test($name: String!, $pincode: Int!, $city: String!) {
          insert_turf_one(object: { name: $name, pincode: $pincode, city: $city }) {
            id
            name
            pincode
            city
            ratings_aggregate {
              aggregate {
                avg {
                  ratings
                }
              }
            }
            facilities_aggregate {
              aggregate {
                count
              }
            }
            status
          }
        }`,
        variables: {
          name: this.name,
          pincode: this.pincode,
          city: this.city,
        },
        update: async (cache, { data: { insert_turf_one } }) => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query {
                      turf {
                        id
                        name
                        pincode
                        city
                        ratings_aggregate {
                          aggregate {
                            avg {
                              ratings
                            }
                          }
                        }
                        facilities_aggregate {
                          aggregate {
                            count
                          }
                        }
                        status
                      }
                    }`,
            })
            data.turf.splice(0, 0, insert_turf_one)
            await cache.writeQuery({
              query: gql`query {
                      turf {
                        id
                        name
                        pincode
                        city
                        ratings_aggregate {
                          aggregate {
                            avg {
                              ratings
                            }
                          }
                        }
                        facilities_aggregate {
                          aggregate {
                            count
                          }
                        }
                        status
                      }
                    }`,
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Added turf successfully!',
                variant: 'success',
              },
            })
            this.$emit('refetch-data', true)
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error adding turf',
                icon: 'XCircleIcon',
                text: e.message,
                variant: 'danger',
              },
            })
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
