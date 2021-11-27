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
              Send Turf for Approval
            </h4>
          </div>
          <span>Please ensure all the details are filled.</span>
        </b-col>

        <!-- twitter -->
        <b-col md="12">
          <br><br>
          <h2 v-if="!sentForApproval">
            Status : {{ approved ? 'Approved' : 'Rejected' }}
          </h2>
          <h2 v-else>
            Status : Sent for Approval
          </h2>
          <b-form-group
            v-if="!approved"
            label-for="reject-reason"
            label="Reject Reason"
            :disabled="true"
          >
            <b-form-input
              id="reject-reason"
              v-model="localOptions.comments"
              :disabled="true"
              placeholder="No comments. Contact Admin."
            />
          </b-form-group>
        </b-col>
        <!--/ twitter -->

        <b-col
          v-if="!approved"
          cols="12"
        >
          <hr class="my-2">
        </b-col>

        <!-- buttons -->
        <b-col
          v-if="!approved"
          cols="12"
        >
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mt-1 mr-1"
            @click.prevent="sendForApproval"
          >
            Send for approval
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
  computed: {
    approved() {
      return !(!this.localOptions.status && this.localOptions.toApprove !== 1)
    },
    sentForApproval() {
      return this.localOptions.toApprove === 1
    },
  },
  created() {
    this.loading = true
    this.localOptions = JSON.parse(JSON.stringify(this.socialData))
    if (!('comments' in this.localOptions)) {
      this.localOptions.comments = null
    }
    this.loading = false
  },
  methods: {
    async sendForApproval() {
      const vm = this
      // eslint-disable-next-line no-unused-vars
      const query = gql`mutation test($id: bigint!) {
          update_turf_by_pk(pk_columns: {id: $id}, _set: {toApprove: 1}) {
            id
          }
        }`
      const vars = {
        id: this.localOptions.id,
      }
      await this.$apollo.mutate({
        mutation: query,
        variables: vars,
        update: async () => {
          // Read the data from our cache for this query.
          try {
            vm.$emit('update', {
              id: this.socialData.id,
              toApprove: 1,
            })
            vm.$router.go(-1)
          } catch (e) {
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
        },
      })
      this.$toast({
        component: ToastificationContent,
        props: {
          title: 'Success',
          icon: 'CheckIcon',
          text: 'Updated turf successfully!',
          variant: 'success',
        },
      })
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
                  toApprove
                  comments
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
                  toApprove
                  comments
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
      const data = {
        id: this.socialData.id,
        toApprove: true,
      }
      await this.updateTurfData(data)
      this.$emit('update', data)
    },
  },
}
</script>
