<template>
  <div>
    <sport-list-add-new
      v-if="isAddNewSportSidebarActive"
      :is-add-new-user-sidebar-active.sync="isAddNewSportSidebarActive"
      @refetch-data="getSports"
    />
    <SportListEdit
      v-if="isEditSportSidebarActive"
      :is-add-new-user-sidebar-active.sync="isEditSportSidebarActive"
      :sport="editingItem"
      @refetch-data="getSports"
      @reset-sport="editingItem"
    />

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
          >
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <!--            <label>Show</label>-->
            <!--            <v-select-->
            <!--              v-model="perPage"-->
            <!--              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"-->
            <!--              :options="perPageOptions"-->
            <!--              :clearable="false"-->
            <!--              class="per-page-selector d-inline-block mx-50"-->
            <!--            />-->
            <!--            <label>entries</label>-->
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-button
                variant="primary"
                @click="isAddNewSportSidebarActive = true"
              >
                <span class="text-nowrap">Add Amenity</span>
              </b-button>
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="sportsFiltered"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="sortBy"
        show-empty
        empty-text="No matching records found"
      >
        <!-- Column: User -->
        <template #cell(img)="data">
          <b-media vertical-align="center">
            <template #aside>
              <img
                v-if="data.item.img !== ''"
                :src="data.item.img"
                style="width: 70%; height: auto; aspect-ratio: 1/1; padding-top: 10px; padding-bottom: 10px;"
              >
              <h5 v-else>
                No image
              </h5>
            </template>
          </b-media>
        </template>
        <!-- Column: User -->
        <template #cell(name)="data">
          <b-media vertical-align="center">
            <template #aside>
              {{ resolveSportName(data.item.name) }}
            </template>
          </b-media>
        </template>

        <!-- Column: Status -->
        <template #cell(disabled)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.disabled)}`"
            class="text-capitalize"
          >
            {{ resolveUserStatusText(data.item.disabled) }}
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
            <b-dropdown-item @click="changeStatus(data.item)">
              <feather-icon :icon="data.item.disabled ? 'CheckCircleIcon' : 'XCircleIcon'" />
              <span class="align-middle ml-50">{{ data.item.disabled ? 'Enable' : 'Disable' }}</span>
            </b-dropdown-item>

            <b-dropdown-item @click="editEnable(data.item)">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item @click="deleteSport(data.item)">
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

      </b-table>
      <!--      <div class="mx-2 mb-2">-->
      <!--        <b-row>-->

      <!--          <b-col-->
      <!--            cols="12"-->
      <!--            sm="6"-->
      <!--            class="d-flex align-items-center justify-content-center justify-content-sm-start"-->
      <!--          >-->
      <!--            <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>-->
      <!--          </b-col>-->
      <!--          Pagination-->
      <!--          <b-col-->
      <!--            cols="12"-->
      <!--            sm="6"-->
      <!--            class="d-flex align-items-center justify-content-center justify-content-sm-end"-->
      <!--          >-->

      <!--            <b-pagination-->
      <!--              v-model="currentPage"-->
      <!--              :total-rows="totalUsers"-->
      <!--              :per-page="perPage"-->
      <!--              first-number-->
      <!--              last-number-->
      <!--              class="mb-0 mt-1 mt-sm-0"-->
      <!--              prev-class="prev-item"-->
      <!--              next-class="next-item"-->
      <!--            >-->
      <!--              <template #prev-text>-->
      <!--                <feather-icon-->
      <!--                  icon="ChevronLeftIcon"-->
      <!--                  size="18"-->
      <!--                />-->
      <!--              </template>-->
      <!--              <template #next-text>-->
      <!--                <feather-icon-->
      <!--                  icon="ChevronRightIcon"-->
      <!--                  size="18"-->
      <!--                />-->
      <!--              </template>-->
      <!--            </b-pagination>-->

      <!--          </b-col>-->

      <!--        </b-row>-->
      <!--      </div>-->
    </b-card>
  </div>
</template>

<script>
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem,
  // BPagination,
} from 'bootstrap-vue'
import gql from 'graphql-tag'
import SportListAddNew from './SportListAddNew.vue'
import SportListEdit from './SportListEdit.vue'

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ToastificationContent,
    SportListAddNew,
    SportListEdit,
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    // eslint-disable-next-line vue/no-unused-components
    BMedia,
    // eslint-disable-next-line vue/no-unused-components
    BAvatar,
    // eslint-disable-next-line vue/no-unused-components
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    // BPagination,
    //
    // vSelect,
  },
  data() {
    return {
      sortBy: 'id',
      isAddNewSportSidebarActive: false,
      isEditSportSidebarActive: false,
      currentPage: 1,
      editingItem: null,
      perPage: 1,
      perPageOptions: [1, 10, 25, 50, 100],
      searchQuery: '',
      sports: [],
      tableColumns: [
        { key: 'id', sortable: true },
        { key: 'img' },
        { key: 'name', sortable: true },
        { key: 'status', sortable: true },
        { key: 'actions' },
      ],
    }
  },
  computed: {
    dataMeta() {
      const localItemsCount = this.totalUsers
      return {
        from: this.perPage * (this.currentPage - 1) + (localItemsCount ? 1 : 0),
        to: this.perPage * (this.currentPage - 1) + localItemsCount,
        of: this.totalUsers,
      }
    },
    totalUsers() {
      return this.sportsFiltered.length
    },
    sportsFiltered() {
      if (this.searchQuery === '') {
        return this.sports
      }
      let res = this.sports.filter(elem => elem.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || this.searchQuery.toLowerCase().includes(elem.name.toLowerCase()))
      let i = 0
      res = res.map(elem => ({
        ...elem,
        // eslint-disable-next-line no-plusplus
        ind: i++,
      }))
      const start = this.perPage * this.currentPage - 1
      const end = start + this.perPage
      return res.filter(elem => elem.ind >= start && elem.ind < end)
    },
  },
  mounted() {
    this.getSports()
  },
  methods: {
    editEnable(item) {
      this.editingItem = item
      this.isEditSportSidebarActive = true
    },
    afterEdit() {
      this.editingItem = null
      this.isEditSportSidebarActive = false
    },
    async deleteSport(item) {
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: Int) {
          delete_amenities(where: {id: {_eq: $id}}) {
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
          id: item.id,
        },
        update: async cache => {
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
            data.amenities = data.amenities.filter(sport => sport.id !== item.id)
            await cache.writeQuery({
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
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: `Deleted ${item.name} successfully!`,
                variant: 'success',
              },
            })
            await this.getSports()
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: `Error deleting ${item.name}!`,
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
          }
        },
      })
    },
    async changeStatus(item) {
      if (item.disabled && item.img === '') {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error',
            icon: 'XCircleIcon',
            text: `Please add an image before enabling ${item.name}`,
            variant: 'danger',
          },
        })
        return
      }
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: Int, $disabled: Boolean) {
          update_amenities(where: {id: {_eq: $id}}, _set: {disabled: $disabled}) {
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
          id: item.id,
          disabled: !item.disabled,
        },
        update: async cache => {
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
            data.amenities = data.amenities.map(sport => {
              if (sport.id === item.id) {
                return {
                  ...sport,
                  disabled: !item.disabled,
                }
              }
              return sport
            })
            await cache.writeQuery({
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
              data,
            })
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: `${(item.disabled ? 'Enabled ' : 'Disabled ') + item.name} successfully!`,
                variant: 'success',
              },
            })
            await this.getSports()
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: `Error ${(item.disabled ? 'enabling ' : 'disabling ') + item.name}!`,
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
          }
        },
      })
    },
    resolveUserStatusVariant(status) {
      if (status) return 'warning'
      return 'success'
    },
    resolveSportName(sport) {
      return sport.toUpperCase()
    },
    resolveUserStatusText(status) {
      if (status) return 'Disabled'
      return 'Active'
    },
    async getSports() {
      const result = await this.$apollo.query({
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
      this.sports = result.data.amenities.map(sport => ({
        id: sport.id,
        disabled: sport.disabled,
        name: sport.name,
        img: sport.images.length > 0 ? sport.images[0].url : '',
        imgID: sport.images.length > 0 ? sport.images[0].id : '',
      }))
    },
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
