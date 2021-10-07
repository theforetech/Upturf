<template>

  <div>

    <user-list-add-new
      :is-add-new-user-sidebar-active.sync="isAddNewUserSidebarActive"
      :role-options="roleOptions"
      :plan-options="planOptions"
      @refetch-data="refetchData"
      @destroy-done="updateFn"
    />

    <!--    &lt;!&ndash; Filters &ndash;&gt;-->
    <!--    <users-list-filters-->
    <!--      :role-filter.sync="roleFilter"-->
    <!--      :plan-filter.sync="planFilter"-->
    <!--      :status-filter.sync="statusFilter"-->
    <!--      :role-options="roleOptions"-->
    <!--      :plan-options="planOptions"-->
    <!--      :status-options="statusOptions"-->
    <!--    />-->

    <!-- Table Container Card -->
    <b-card
      no-body
      class="mb-0"
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          />

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Search..."
              />
              <b-button
                variant="primary"
                @click="isAddNewUserSidebarActive = true"
              >
                <span class="text-nowrap">Add Turf</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        style="min-height: 200px!important;"
        :items="turfs"
        striped
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="isSortDirDesc"
      >
        <!-- Column: ID -->
        <template #cell(id)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.id }}</span>
          </div>
        </template>
        <!-- Column: Name -->
        <template #cell(name)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.name }}</span>
          </div>
        </template>
        <!-- Column: Pincode -->
        <template #cell(pincode)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.pincode }}</span>
          </div>
        </template>
        <!-- Column: City -->
        <template #cell(city)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.city }}</span>
          </div>
        </template>
        <!-- Column: numFacilities -->
        <template #cell(numFacilities)="data">
          <div class="text-nowrap">
            <span class="align-text-top text-capitalize">{{ data.item.numFacilities }}</span>
          </div>
        </template>
        <!-- Column: rating -->
        <template #cell(rating)="data">
          <div class="text-nowrap">
            <b-badge
              v-if="data.item.rating !== null"
              variant="success"
              class="badge"
            >
              <span>{{ data.item.rating }}</span>
              <feather-icon
                icon="StarIcon"
                class="star-icon"
              />
            </b-badge>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ data.item.status ? 'Enabled' : 'Disabled' }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-dropdown
            variant="link"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
            <b-dropdown-item :to="{ name: 'vendor-turf', params: { id: data.item.id } }">
              <feather-icon icon="FileTextIcon" />
              <span class="align-middle ml-50">Details</span>
            </b-dropdown-item>

            <b-dropdown-item :to="{ name: 'vendor-turf-edit', params: { id: data.item.id } }">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item>
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

      </b-table>
    </b-card>
  </div>
</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable,
  BBadge, BDropdown, BDropdownItem,
} from 'bootstrap-vue'
import store from '@/store'
import { ref, onUnmounted } from '@vue/composition-api'
import { avatarText } from '@core/utils/filter'
// import UsersListFilters from './UsersListFilters.vue'
import gql from 'graphql-tag'
import useUsersList from './useUsersList'
import userStoreModule from '../userStoreModule'
import UserListAddNew from './UserListAddNew.vue'

export default {
  components: {
    UserListAddNew,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BBadge,
    BDropdown,
    BDropdownItem,
  },
  data() {
    return {
      isAddNewUserSidebarActive: false,
      tableColumns: [
        { key: 'ID', sortable: true },
        { key: 'name', sortable: true },
        { key: 'pincode', sortable: true },
        { key: 'city', sortable: true },
        { key: 'numFacilities', sortable: true },
        { key: 'rating', sortable: true },
        { key: 'status', sortable: true },
        { key: 'actions' },
      ],
      sortBy: 'id',
      isSortDirDesc: false,
      turfs: [],
    }
  },
  mounted() {
    this.getTurfs()
  },
  methods: {
    updateFn() {
      this.isAddNewUserSidebarActive = false
    },
    resolveUserStatusVariant(status) {
      if (status === false) return 'warning'
      if (status === true) return 'success'
      return 'primary'
    },
    refetchData() {
      const vm = this
      setTimeout(() => {
        vm.getTurfs().then(() => {
          vm.updateFn()
        })
      }, 1500)
    },
    async getTurfs() {
      const result = await this.$apollo.query({
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
      this.turfs = result.data.turf.map(turf => ({
        id: turf.id,
        name: turf.name,
        pincode: turf.pincode,
        city: turf.city,
        status: turf.status,
        rating: turf.ratings_aggregate.aggregate.avg.ratings,
        numFacilities: turf.facilities_aggregate.aggregate.count || 0,
      }))
    },
  },
  setup() {
    const USER_APP_STORE_MODULE_NAME = 'app-user'

    // Register module
    if (!store.hasModule(USER_APP_STORE_MODULE_NAME)) store.registerModule(USER_APP_STORE_MODULE_NAME, userStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(USER_APP_STORE_MODULE_NAME)) store.unregisterModule(USER_APP_STORE_MODULE_NAME)
    })

    const isAddNewUserSidebarActive = ref(false)

    const roleOptions = [
      { label: 'Admin', value: 'admin' },
      { label: 'Author', value: 'author' },
      { label: 'Editor', value: 'editor' },
      { label: 'Maintainer', value: 'maintainer' },
      { label: 'Subscriber', value: 'subscriber' },
    ]

    const planOptions = [
      { label: 'Basic', value: 'basic' },
      { label: 'Company', value: 'company' },
      { label: 'Enterprise', value: 'enterprise' },
      { label: 'Team', value: 'team' },
    ]

    const statusOptions = [
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ]

    const {
      fetchUsers,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      refUserListTable,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    } = useUsersList()

    return {

      // Sidebar
      isAddNewUserSidebarActive,

      fetchUsers,
      perPage,
      currentPage,
      totalUsers,
      dataMeta,
      perPageOptions,
      searchQuery,
      refUserListTable,

      // Filter
      avatarText,

      // UI
      resolveUserRoleVariant,
      resolveUserRoleIcon,

      roleOptions,
      planOptions,
      statusOptions,

      // Extra Filters
      roleFilter,
      planFilter,
      statusFilter,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
