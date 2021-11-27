<template>
  <div v-if="loading">
    <b-skeleton-table
      class="mt-2"
      :rows="7"
      :columns="4"
      :table-props="{ bordered: true, striped: true }"
    />
  </div>
  <div v-else>
    <b-tabs
      vertical
      content-class="col-12 col-md-9 mt-1 mt-md-0"
      pills
      nav-wrapper-class="col-md-3 col-12"
      nav-class="nav-left"
    >
      <!-- general tab -->
      <b-tab active>
        <!-- title -->
        <template #title>
          <feather-icon
            icon="UserIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">General</span>
        </template>

        <account-setting-general
          :general-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>
      <!--/ general tab -->

      <!-- change password tab -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="ImageIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Featured Pictures</span>
        </template>

        <account-setting-password
          :general-data="turfData"
          :turfid="id"
        />
      </b-tab>
      <!--/ change password tab -->

      <!-- info -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="InfoIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Information</span>
        </template>

        <account-setting-information
          :information-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>

      <!-- social links -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="LinkIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Social</span>
        </template>

        <account-setting-social
          :social-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>

      <!-- notification -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="MapPinIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Location</span>
        </template>

        <account-setting-notification
          :social-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>

      <!-- notification -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="MapIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Facilities</span>
        </template>

        <account-setting-facilities
          :notification-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>

      <!-- notification -->
      <b-tab>

        <!-- title -->
        <template #title>
          <feather-icon
            icon="CheckIcon"
            size="18"
            class="mr-50"
          />
          <span class="font-weight-bold">Approval</span>
        </template>

        <account-setting-approval
          :social-data="turfData"
          @update="updateTurfData"
        />
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { BTabs, BTab, BSkeletonTable } from 'bootstrap-vue'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import AccountSettingGeneral from './AccountSettingGeneral.vue'
import AccountSettingPassword from './AccountSettingPassword.vue'
import AccountSettingInformation from './AccountSettingInformation.vue'
import AccountSettingSocial from './AccountSettingSocial.vue'
import AccountSettingApproval from './AccountSettingApproval.vue'
import AccountSettingNotification from './AccountSettingNotification.vue'
import AccountSettingFacilities from './AccountSettingFacilities.vue'

export default {
  components: {
    BTabs,
    BTab,
    BSkeletonTable,
    AccountSettingGeneral,
    AccountSettingPassword,
    AccountSettingInformation,
    AccountSettingSocial,
    AccountSettingApproval,
    AccountSettingNotification,
    AccountSettingFacilities,
  },
  data() {
    return {
      id: 0,
      options: {},
      turfData: {
        contactName: '',
        contactPhone: null,
        contactEmail: '',
        name: '',
        city: '',
        state: '',
        pincode: 0,
        country: 'India',
        lat: null,
        lon: null,
        gMapsBusinessLink: '',
        facebook: '',
        twitter: '',
        google: '',
        instagram: '',
        rating: null,
        facilities: [],
        status: false,
      },
      turf: '',
      loading: true,
    }
  },
  async beforeCreate() {
    this.$http.get('/account-setting/data').then(res => {
      this.options = res.data
    })
  },
  async beforeMount() {
    this.id = this.$route.params.id
    await this.getTurfData()
  },
  methods: {
    async getTurfData() {
      const result = await this.$apollo.query({
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
          id: this.id,
        },
      }).catch(e => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error fetching turf',
            icon: 'XCircleIcon',
            text: e,
            variant: 'danger',
          },
        })
        this.$router.go(-1)
      })
      this.loading = false
      this.turf = result.data.turf_by_pk
      Object.keys(this.turf).forEach(property => {
        if (property === '__typename') {
          return
        }
        if (property !== 'ratings_aggregate') {
          this.turfData[property] = this.turf[property]
        } else {
          try {
            this.turfData.rating = this.turf.ratings_aggregate.aggregate.avg.ratings || null
          } catch (e) {
            this.turfData.rating = null
          }
        }
      })
    },
    updateTurfData() {
      // update turf here
      this.getTurfData()
    },
  },
}
</script>
