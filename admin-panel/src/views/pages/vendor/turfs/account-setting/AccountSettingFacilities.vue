<template>
  <b-card>
    <user-list-add-new
      :turf-i-d="notificationData.id"
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      @refetch-data="refetchData"
      @destroy-done="updateFn"
      @update="refetchData"
    />
    <b-row>
      <b-col sm="12">
        <div class="mb-2">

          <!-- Table Top -->
          <b-row>

            <!-- Per Page -->
            <b-col
              cols="12"
              md="6"
              class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
            >
              <h3 class="section-label mx-1 mb-2">
                Facilities
              </h3>
            </b-col>

            <!-- Search -->
            <b-col
              cols="12"
              md="6"
            >
              <div class="d-flex align-items-center justify-content-end">
                <b-button
                  variant="primary"
                  @click="isAddNewUserSidebarActive = true"
                >
                  <span class="text-nowrap">Add Facility</span>
                </b-button>
              </div>
            </b-col>
          </b-row>

        </div>
        <b-table
          :items="items"
          :fields="fields"
          striped
          responsive
          @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)"
        >

          <template
            #row-details="row"
          >
            <b-card>
              <b-row class="mb-2">
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Sport : </strong>{{ row.item.sport.name[0].toUpperCase() + row.item.sport.name.slice(1) }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Type : </strong>{{ row.item.type }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Slot Size : </strong>{{ row.item.slot_size }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Start Time : </strong>{{ row.item.start_time }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>End Time : </strong>{{ row.item.end_time }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Price : </strong>{{ row.item.price }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Weekend Price : </strong>{{ row.item.weekendPrice }}
                </b-col>
                <b-col
                  md="4"
                  class="mb-1"
                >
                  <strong>Max Players : </strong>{{ row.item.max_players }}
                </b-col>
              </b-row>

              <b-button
                size="sm"
                variant="outline-secondary"
                @click="row.toggleDetails"
              >
                Hide Details
              </b-button>

              <b-button
                class="ml-1"
                size="sm"
                variant="outline-secondary"
                @click="toggleStatus(row.item)"
              >
                {{ row.item.status !== 3 ? 'Disable' : 'Enable' }}
              </b-button>
            </b-card>
          </template>

          <template #cell(sport)="data">
            <b-avatar :src="data.item.sport.images[0].url" />
          </template>

          <template #cell(status)="data">
            <b-badge :variant="status[1][data.value]">
              {{ status[0][data.value] }}
            </b-badge>
          </template>
        </b-table>
      </b-col>
      <!--/ buttons -->
    </b-row>
  </b-card>
</template>

<script>
import {
  BTable, BButton, BCard, BRow, BCol, BAvatar, BBadge,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import UserListAddNew from './UserListAddNew.vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BTable,
    BButton,
    BBadge,
    BAvatar,
    UserListAddNew,
  },
  directives: {
    Ripple,
  },
  props: {
    notificationData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isAddNewUserSidebarActive: false,
      localOptions: JSON.parse(JSON.stringify(this.notificationData)),
      fields: [
        { key: 'id', label: 'ID', tdClass: 'clickCursor' },
        { key: 'sport', label: 'Sport', tdClass: 'clickCursor' },
        { key: 'type', label: 'Type', tdClass: 'clickCursor' },
        { key: 'slot_size', label: 'Slot Size', tdClass: 'clickCursor' },
        { key: 'price', label: 'Price', tdClass: 'clickCursor' },
        { key: 'status', label: 'Status', tdClass: 'clickCursor' },
      ],
      items: [],
      status: [
        {
          1: 'Creating Slots', 2: 'Active', 3: 'Disabled',
        },
        {
          1: 'light-primary', 2: 'light-success', 3: 'light-danger',
        }],
    }
  },
  mounted() {
    this.items = this.notificationData.facilities
  },
  methods: {
    updateFn() {
      this.isAddNewUserSidebarActive = false
    },
    refetchData() {
      this.$emit('update', true)
    },
    myRowClickHandler(row) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      row._showDetails = !row._showDetails
    },
    async toggleStatus(row) {
      await this.$apollo.mutate({
        mutation: gql`mutation ($id: Int, $status: Int) {
         update_facilities(where: {id: {_eq: $id}}, _set: { status: $status }) {
            returning {
                id
            }
          }
        }`,
        variables: {
          id: row.id,
          // eslint-disable-next-line no-nested-ternary
          status: row.status === 1 ? 1 : row.status === 2 ? 3 : 2,
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
                id: this.notificationData.id,
              },
            })
            data.turf_by_pk.facilities.map(facility => {
              if (facility.id === row.id) {
                return {
                  ...facility,
                  // eslint-disable-next-line no-nested-ternary
                  status: facility.status === 1 ? 1 : facility.status === 2 ? 3 : 2,
                }
              }
              return facility
            })
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
                id: this.notificationData.id,
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
            this.refetchData()
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
  },
}
</script>

<style>
.clickCursor {
  cursor: pointer;
}
</style>
