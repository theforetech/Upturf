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
          Edit Sport
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
          <b-form-group
            label="Id"
            disabled
            label-for="id"
          >
            <b-form-input
              id="id"
              :value="sportData.id"
              disabled
              autofocus
              trim
              placeholder="Id"
            />
          </b-form-group>

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
                placeholder="Sport"
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
              Update
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
      <h3 class="p-2">
        Image
      </h3>

      <template v-if="sportData.img !== ''">
        <img
          class="p-3"
          :src="sportData.img"
        >
        <br>
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="warning"
          class="ml-2"
          @click="deleteImage"
        >
          Delete
        </b-button>
      </template>
      <template
        v-else
      >
        <div
          class="pl-2"
        >
          <h5 class="mb-1">
            Upload Image
          </h5>
          <b-row>
            <b-col cols="8">
              <b-form-file
                v-model="file"
                accept="image/jpeg, image/png"
                @change="uploadFile"
              />
            </b-col>
            <b-col
              cols="4"
              class="pr-0 mr-0"
            >
              <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="primary"
                @click="uploadFile"
              >
                Upload
              </b-button>
            </b-col>
          </b-row>
        </div>
      </template>
    </template>
  </b-sidebar>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BSidebar, BForm, BFormGroup, BFormInput, BFormInvalidFeedback, BButton,
  BFormFile, BRow, BCol,
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required, alphaNum, email } from '@validations'
import Ripple from 'vue-ripple-directive'
import countries from '@/@fake-db/data/other/countries'
import gql from 'graphql-tag'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    BRow,
    BCol,
    BSidebar,
    BForm,
    BFormFile,
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
    sport: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      sportData: {},
      loading: false,
      file: null,
      required,
      alphaNum,
      email,
      countries,
    }
  },
  mounted() {
    this.sportData = this.sport
  },
  beforeDestroy() {
    this.$emit('reset-sport', true)
  },
  methods: {
    async getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    resetForm() {
      this.loading = false
      this.sportData = {
        name: '',
        img: '',
      }
    },
    async uploadFile() {
      const { file } = this
      const fileData2 = await this.getBase64(file)
      const fileData = fileData2.split('base64,')[1]
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: Int, $base64str: String!, $name: String!, $type: String!) {
          uploadFile(base64str: $base64str, name: $name, type: $type, sportID: $id) {
            url,
            id
          }
        }`,
        variables: {
          base64str: fileData,
          id: this.sportData.id,
          name: file.name,
          type: file.type,
        },
        update: async (cache, { data: { uploadFile } }) => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query {
                      sport {
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
            data.sport = data.sport.map(sport => {
              if (sport.id === this.sportData.id) {
                return {
                  ...sport,
                  images: [
                    uploadFile,
                  ],
                }
              }
              return sport
            })
            await cache.writeQuery({
              query: gql`query {
                      sport {
                        disabled
                        id
                        name
                        images {
                            id
                            url
                        }
                      }
                    }`,
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Uploaded image successfully!',
                variant: 'success',
              },
            })
            this.$emit('refetch-data', true)
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error uploading image',
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
    async deleteImage() {
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: bigint) {
          delete_images(where: {id: {_eq: $id}}) {
            returning {
              sport {
                disabled
                id
                name
                images {
                    id
                    url
                }
              }
            }
            affected_rows
          }
        }`,
        variables: {
          id: this.sportData.imgID,
        },
        update: async cache => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query {
                      sport {
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
            data.sport = data.sport.map(sport => {
              if (sport.id === this.sportData.id) {
                return {
                  ...sport,
                  images: [],
                }
              }
              return sport
            })
            await cache.writeQuery({
              query: gql`query {
                      sport {
                        disabled
                        id
                        name
                        images {
                            id
                            url
                        }
                      }
                    }`,
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Deleted image successfully!',
                variant: 'success',
              },
            })
            this.$emit('refetch-data', true)
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error deleting image',
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
    async onSubmit() {
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: Int!, $name: String!) {
          update_sport(where: {id: {_eq: $id}}, _set: {name: $name}) {
            returning {
              disabled
              id
              name
              images {
                  id
                  url
              }
            }
            affected_rows
          }
        }`,
        variables: {
          id: this.sportData.id,
          name: this.sportData.name,
        },
        update: async cache => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query {
                      sport {
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
            data.sport = data.sport.map(sport => {
              if (sport.id === this.sportData.id) {
                return {
                  ...sport,
                  name: this.sportData.name,
                }
              }
              return sport
            })
            await cache.writeQuery({
              query: gql`query {
                      sport {
                        disabled
                        id
                        name
                        images {
                            id
                            url
                        }
                      }
                    }`,
              data,
            })
            await this.getSports()
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error updating sport',
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
          }
        },
      })
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Success',
          icon: 'CheckIcon',
          text: 'Updated sport successfully!',
          variant: 'success',
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
