<template>
  <b-card-code>

    <!-- input search -->
    <div class="custom-search d-flex justify-content-end">
      <b-form-group>
        <div class="d-flex align-items-center">
          <label class="mr-1">Search</label>
          <b-form-input
            v-model="searchTerm"
            placeholder="Search"
            type="text"
            class="d-inline-block"
          />
        </div>
      </b-form-group>
    </div>

    <!-- table -->
    <vue-good-table
      v-if="!loading"
      :columns="columns"
      :rows="bookings"
      :rtl="direction"
      :search-options="{
        enabled: true,
        externalQuery: searchTerm }"
      :pagination-options="{
        enabled: true,
        perPage:pageLength
      }"
    >
      <template
        slot="table-row"
        slot-scope="props"
      >

        <!-- Column: Name -->
        <span
          v-if="props.column.field === 'facility.sport.name'"
          class="text-nowrap"
        >
          <b-avatar
            :src="props.row.facility.sport.images[0].url"
            class="mx-1"
          />
        </span>
        <div
          v-else-if="props.column.field === 'contact_name'"
          class="text-nowrap"
        >
          <span class="text-nowrap">{{ props.row.contact_name }}</span>
        </div>

        <!-- Column: Status -->

        <span v-else-if="props.column.field === 'payment_status'">
          <b-badge :variant="statusVariant(props.row.payment_status)">
            {{ props.row.payment_status }}
          </b-badge>
        </span>

        <span v-else-if="props.column.field === 'reservation_date'">
          {{ moment(props.row.reservation_date).format('Do MMM YYYY') }}
        </span>
        <span v-else-if="props.column.field === 'created_at'">
          {{ moment(props.row.created_at).format('Do MMM YYYY') }}
        </span>

        <span v-else-if="props.column.field === 'amount'">
          ₹ {{ props.row.amount }}
        </span>

        <!-- Column: Action -->
        <span v-else-if="props.column.field === 'action'">
          <span>
            <b-dropdown
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
            >
              <template v-slot:button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="text-body align-middle mr-25"
                />
              </template>
              <b-dropdown-item
                @click="navigateTo(props.row.id)"
              >
                <feather-icon
                  icon="Edit2Icon"
                  class="mr-50"
                />
                <span>View</span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="cancelBooking(props.row.id)"
              >
                <feather-icon
                  icon="TrashIcon"
                  class="mr-50"
                />
                <span>Cancel</span>
              </b-dropdown-item>
            </b-dropdown>
          </span>
        </span>

        <!-- Column: Common -->
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

      <!-- pagination -->
      <template
        slot="pagination-bottom"
        slot-scope="props"
      >
        <div class="d-flex justify-content-between flex-wrap">
          <div class="d-flex align-items-center mb-0 mt-1">
            <span class="text-nowrap">
              Showing 1 to
            </span>
            <b-form-select
              v-model="pageLength"
              :options="['3','5','10']"
              class="mx-1"
              @input="(value)=>props.perPageChanged({currentPerPage:value})"
            />
            <span class="text-nowrap "> of {{ props.total }} entries </span>
          </div>
          <div>
            <b-pagination
              :value="1"
              :total-rows="props.total"
              :per-page="pageLength"
              first-number
              last-number
              align="right"
              prev-class="prev-item"
              next-class="next-item"
              class="mt-1 mb-0"
              @input="(value)=>props.pageChanged({currentPage:value})"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </div>
        </div>
      </template>
    </vue-good-table>

    <template #code>
      {{ codeColumnSearch }}
    </template>
  </b-card-code>
</template>

<script>
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import {
  BAvatar, BBadge, BPagination, BFormGroup, BFormInput, BFormSelect, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import { VueGoodTable } from 'vue-good-table'
import store from '@/store'
import moment from 'moment'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { codeColumnSearch } from '../../../table/vue-good-table/code'

export default {
  components: {
    BCardCode,
    VueGoodTable,
    BAvatar,
    BBadge,
    BPagination,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BDropdown,
    BDropdownItem,
  },
  data() {
    return {
      loading: false,
      moment,
      bookings: [],
      pageLength: 3,
      dir: false,
      codeColumnSearch,
      columns: [
        {
          label: 'Sport',
          field: 'facility.sport.name',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Sport',
          },
        },
        {
          label: 'Name',
          field: 'contact_name',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Name',
          },
        },
        {
          label: 'Phone Number',
          field: 'contact_phone',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Email',
          },
        },
        {
          label: 'Booking Created On',
          field: 'created_at',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Date',
          },
        },
        {
          label: 'Reservation Date',
          field: 'reservation_date',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Date',
          },
        },
        {
          label: 'Amount',
          field: 'amount',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Salary',
          },
        },
        {
          label: 'Status',
          field: 'payment_status',
          filterOptions: {
            enabled: true,
            placeholder: 'Search Status',
          },
        },
        {
          label: 'Action',
          field: 'action',
        },
      ],
      rows: [],
      searchTerm: '',
    }
  },
  computed: {
    statusVariant() {
      const statusColor = {
        /* eslint-disable key-spacing */
        Current      : 'light-primary',
        success : 'light-success',
        Rejected     : 'light-danger',
        Resigned     : 'light-warning',
        Applied      : 'light-info',
        /* eslint-enable key-spacing */
      }

      return status => statusColor[status]
    },
    direction() {
      if (store.state.appConfig.isRTL) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.dir = true
        return this.dir
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.dir = false
      return this.dir
    },
  },
  mounted() {
    this.getBookings()
  },
  created() {
    this.$http.get('/good-table/basic')
      .then(res => { this.rows = res.data })
  },
  methods: {
    async cancelBooking(id) {
      const res = await this.$apollo.mutate({
        mutation: gql`mutation ($id: uuid!) {
          cancel(bookingID: $id) {
            id
            refund
            status
          }
        }`,
        variables: {
          id,
        },
      }).catch(e => {
        const msg = e.message
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Cancelling',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
      })
      try {
        if (res === undefined || !('data' in res) || !('cancel' in res.data) || !res.data.cancel) {
          return
        }
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Booking Cancelled!',
            icon: 'CheckIcon',
            text: 'We hope to serve you again.',
            variant: 'success',
          },
        },
        {
          timeout: 4000,
        })
        this.getBookings()
      } catch (e) {
        const msg = e.message
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error Cancelling',
            icon: 'XCircleIcon',
            text: msg,
            variant: 'danger',
          },
        })
      }
    },
    async getBookings() {
      this.loading = true
      const result = await this.$apollo.query({
        query: gql`query ($startDate: date!,$endDate:date!) {
         bookings(where: {payment_status: {_in: [success, refunded]},booking_status: {_in: [1,2]}, reservation_date: {_gte: $startDate, _lte: $endDate}}) {
                amount
                booking_status
                contact_name
                contact_phone
                payment_status
                reservation_date
                facility {
                  id
                  type
                  sport {
                    name
                    images {
                      url
                    }
                  }
                }
                booked_slots {
                  date
                  startTime
                  endTime
                }
                booked_slots_aggregate{
                  aggregate{
                    count
                  }
                }
                created_at
                id
              }
            }`,
        fetchPolicy: 'no-cache',
        variables: {
          startDate: moment().format('YYYY-MM-DD'),
          endDate: moment().add(10, 'd').format('YYYY-MM-DD'),
        },
      })
      this.bookings = result.data.bookings.map(booking => ({
        ...booking,
        created_at: moment(booking.created_at).format('YYYY-MM-DD'),
      }))
      setTimeout(() => { this.loading = false }, 500)
    },
    navigateTo(bookingId) {
      this.$router.push({
        name: 'vendor-summary',
        params: {
          id: bookingId,
        },
      })
    },
  },
}
</script>
