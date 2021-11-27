<template>
  <b-sidebar
    id="add-new-user-sidebar"
    :visible="isAddNewUserSidebarActive"
    bg-variant="white"
    sidebar-class="sidebar-lg"
    shadow
    backdrop
    no-header
    right
    @hidden="resetForm"
    @change="(val) => $emit('update:is-add-new-user-sidebar-active', val)"
  >
    <template #default="{ hide }">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
        <h5 class="mb-0">
          Add New Amenity
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
          @submit.prevent="handleSubmit(onSubmit)"
          @reset.prevent="resetForm"
        >

          <!-- Full Name -->
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
                v-model="sportData.name"
                autofocus
                :state="getValidationState(validationContext)"
                trim
                placeholder="Amenity"
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
  // BFormFile,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaNum, email } from '@validations'
import Ripple from 'vue-ripple-directive'
import countries from '@/@fake-db/data/other/countries'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BSidebar,
    BForm,
    // BFormFile,
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
    event: 'update:is-add-new-user-sidebar-active',
  },
  props: {
    isAddNewUserSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      sportData: {
        name: '',
        img: '',
      },
      loading: false,
      file: null,
      required,
      alphaNum,
      email,
      countries,
    }
  },
  methods: {
    resetForm() {
      this.loading = false
      this.sportData = {
        name: '',
        img: '',
      }
    },
    async onSubmit() {
      await this.$apollo.mutate({
        mutation: gql`mutation test($name: String!) {
          insert_amenities_one(object: { name: $name }) {
            disabled
            id
            name
            images {
                id
                url
            }
          }
        }`,
        variables: {
          name: this.sportData.name,
        },
        update: async (cache, { data: { insert_amenities_one } }) => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query {
                      amenities {
                        disabled
                        id
                        name
                        images {
                            id
                            url
                        }
                      }
                    }`,
            })
            data.amenities.splice(0, 0, insert_amenities_one)
            // await cache.writeQuery({
            //   query: gql`query {
            //           amenities {
            //             disabled
            //             id
            //             name
            //             images {
            //                 id
            //                 url
            //             }
            //           }
            //         }`,
            //   data,
            // })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Added amenity successfully!',
                variant: 'success',
              },
            })
            this.isAddNewUserSidebarActive = false
            this.$emit('refetch-data', true)
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error updating amenity',
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
          }
        },
      })
      this.resetForm()
      this.isAddNewUserSidebarActive = false
    },
    getValidationState({
      dirty, validated, required: fieldRequired, changed, valid = null,
    }) {
      const result = dirty || validated ? valid : null
      return !fieldRequired && !changed ? null : result
    },
  },
  // setup(props, { emit }) {
  //   const blankUserData = {
  //     fullName: '',
  //     username: '',
  //     email: '',
  //     role: null,
  //     currentPlan: null,
  //     company: '',
  //     country: '',
  //     contact: '',
  //   }
  //
  //   const userInfo = ref(JSON.parse(JSON.stringify(blankUserData)))
  //   const resetuserData = () => {
  //     userInfo.value = JSON.parse(JSON.stringify(blankUserData))
  //   }
  //
  //   const onSubmit = () => {
  //     store.dispatch('app-user/addUser', userInfo.value)
  //       .then(() => {
  //         emit('refetch-data')
  //         emit('update:is-add-new-user-sidebar-active', false)
  //       })
  //   }
  //
  //   const {
  //     refFormObserver,
  //     getValidationState,
  //     resetForm,
  //   } = formValidation(resetuserData)
  //
  //   return {
  //     userInfo,
  //     onSubmit,
  //
  //     refFormObserver,
  //     getValidationState,
  //     resetForm,
  //   }
  // },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';

#add-new-user-sidebar {
  .vs__dropdown-menu {
    max-height: 200px !important;
  }
}
</style>
