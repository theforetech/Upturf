<template>
  <b-card>
    <b-form>
      <b-row>
        <b-col cols="12">
          <div class="d-flex align-items-center mb-2">
            <feather-icon
              icon="LinkIcon"
              size="18"
            />
            <h4 class="mb-0 ml-75">
              Social Links
            </h4>
          </div>
        </b-col>

        <!-- twitter -->
        <b-col md="6">
          <b-form-group
            label-for="account-twitter"
            label="Twitter"
          >
            <b-form-input
              id="account-twitter"
              v-model="localOptions.twitter"
              placeholder="Add link"
            />
          </b-form-group>
        </b-col>
        <!--/ twitter -->

        <!-- facebook -->
        <b-col md="6">
          <b-form-group
            label-for="account-facebook"
            label="Facebook"
          >
            <b-form-input
              id="account-facebook"
              v-model="localOptions.facebook"
              placeholder="Add link"
            />
          </b-form-group>
        </b-col>
        <!--/ facebook -->

        <!-- google+ -->
        <b-col md="6">
          <b-form-group
            label-for="account-google"
            label="Google+"
          >
            <b-form-input
              id="account-google"
              v-model="localOptions.google"
              placeholder="Add link"
            />
          </b-form-group>
        </b-col>
        <!--/ google+ -->

        <!-- instagram -->
        <b-col md="6">
          <b-form-group
            label="Instagram"
            label-for="account-instagram"
          >
            <b-form-input
              id="account-instagram"
              v-model="localOptions.instagram"
              placeholder="Add link"
            />
          </b-form-group>
        </b-col>
        <!--/ instagram -->

        <b-col cols="12">
          <hr class="my-2">
        </b-col>

        <!-- buttons -->
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
            class="mt-1 ml-25"
            variant="outline-secondary"
            @click.prevent="resetForm"
          >
            Cancel
          </b-button>
        </b-col>
        <!--/ buttons -->
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BButton, BForm, BFormGroup, BFormInput, BRow, BCol, BCard,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
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
    socialData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      localOptions: {},
    }
  },
  created() {
    this.loading = true
    this.localOptions = JSON.parse(JSON.stringify(this.socialData))
    if (!('facebook' in this.localOptions)) {
      this.localOptions.facebook = ''
    }
    if (!('instagram' in this.localOptions)) {
      this.localOptions.instagram = ''
    }
    if (!('twitter' in this.localOptions)) {
      this.localOptions.twitter = ''
    }
    if (!('google' in this.localOptions)) {
      this.localOptions.google = ''
    }
    this.loading = false
  },
  methods: {
    resetForm() {
      this.localOptions = JSON.parse(JSON.stringify(this.socialData))
      if (!('facebook' in this.localOptions)) {
        this.localOptions.facebook = ''
      }
      if (!('instagram' in this.localOptions)) {
        this.localOptions.instagram = ''
      }
      if (!('twitter' in this.localOptions)) {
        this.localOptions.twitter = ''
      }
      if (!('google' in this.localOptions)) {
        this.localOptions.google = ''
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
        mutation: gql`mutation ($id: bigint!, $instagram: String, $facebook: String, $twitter: String, $google: String) {
         update_turf(where: {id: {_eq: $id}}, _set: { instagram: $instagram, facebook: $facebook, google: $google, twitter: $twitter }) {
            returning {
                id
            }
          }
        }`,
        variables: {
          ...values,
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
                  lat
                  lon
                }
              }`,
              variables: {
                id: values.id,
              },
            })
            data.turf_by_pk = {
              ...data.turf_by_pk,
              ...values,
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
                  lat
                  lon
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
      if (this.localOptions.facebook !== this.socialData.facebook || this.localOptions.google !== this.socialData.google || this.localOptions.twitter !== this.socialData.twitter || this.localOptions.instagram !== this.socialData.instagram) {
        const data = {
          id: this.socialData.id,
          instagram: this.localOptions.instagram || null,
          twitter: this.localOptions.twitter || null,
          google: this.localOptions.google || null,
          facebook: this.localOptions.facebook || null,
        }
        await this.updateTurfData(data)
        this.$emit('update', data)
      }
    },
  },
}
</script>
