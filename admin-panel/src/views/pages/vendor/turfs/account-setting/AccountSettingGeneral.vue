<template>
  <b-card>
    <!-- form -->
    <b-form class="mt-2">
      <b-row>
        <b-col sm="6">
          <b-form-group
            label="Turf Name"
            label-for="turf-name"
          >
            <b-form-input
              v-model="optionsLocal.name"
              placeholder="Turf Name"
              name="name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="E-mail"
            label-for="account-e-mail"
          >
            <b-form-input
              v-model="optionsLocal.contactEmail"
              name="email"
              placeholder="Email"
            />

          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Contact Name"
            label-for="contact-name"
          >
            <b-form-input
              v-model="optionsLocal.contactName"
              name="contactName"
              placeholder="Contact Name"
            />
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Contact Phone"
            label-for="contact-phone"
          >
            <b-form-input
              v-model="optionsLocal.contactPhone"
              name="contactPhone"
              placeholder="xxxxxxxxxx"
            />
          </b-form-group>
        </b-col>

        <b-col cols="12">
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-2 mr-1"
            @click="submitForm"
          >
            Save changes
          </b-button>
          <b-button
            v-ripple.400="'rgba(186, 191, 199, 0.15)'"
            variant="outline-secondary"
            type="reset"
            class="mt-2"
            @click.prevent="resetForm"
          >
            Reset
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BCard,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import { ref } from '@vue/composition-api'
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
  },
  directives: {
    Ripple,
  },
  props: {
    generalData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      optionsLocal: JSON.parse(JSON.stringify(this.generalData)),
      profileFile: null,
    }
  },
  methods: {
    resetForm() {
      this.optionsLocal = JSON.parse(JSON.stringify(this.generalData))
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
        mutation: gql`mutation ($id: bigint!, $name: String, $contactEmail: String, $contactName: String, $contactPhone: bigint) {
         update_turf(where: {id: {_eq: $id}}, _set: { name: $name, contactName: $contactName, contactEmail: $contactEmail, contactPhone: $contactPhone}) {
            returning {
                id
            }
          }
        }`,
        variables: {
          id: values.id,
          name: values.name,
          contactEmail: values.contactEmail,
          contactName: values.contactName,
          contactPhone: values.contactPhone,
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
      if (this.optionsLocal.name !== this.generalData.name || this.optionsLocal.contactEmail !== this.generalData.contactEmail || this.optionsLocal.contactPhone !== this.generalData.contactPhone || this.optionsLocal.contactName !== this.generalData.contactName) {
        await this.updateTurfData({
          id: this.generalData.id,
          name: this.optionsLocal.name,
          contactEmail: this.optionsLocal.contactEmail,
          contactPhone: this.optionsLocal.contactPhone,
          contactName: this.optionsLocal.contactName,
        })
        this.$emit('update', {
          id: this.generalData.id,
          name: this.optionsLocal.name,
          contactEmail: this.optionsLocal.contactEmail,
          contactPhone: this.optionsLocal.contactPhone,
          contactName: this.optionsLocal.contactName,
        })
      }
    },
  },
  setup() {
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, previewEl)

    return {
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
}
</script>
