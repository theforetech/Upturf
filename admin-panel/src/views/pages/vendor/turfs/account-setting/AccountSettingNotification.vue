<template>
  <b-card>
    <b-row>
      <template>
        <b-col sm="12">
          <h6 class="section-label mx-1 mb-2">
            Google Maps
          </h6>
        </b-col>
        <b-col sm="6">
          <b-form-group
            label="Business Link"
            label-for="business-link"
          >
            <b-form-input
              v-model="vm.searchPlace"
              v-gmaps-searchbox:location.url.geometry="vm"
              placeholder="Search For Business"
              name="name"
              autocomplete="off"
            />
          </b-form-group>
        </b-col>
      </template>
      <template
        v-if="locationSelected"
      >

        <!-- application switch -->
        <b-col sm="12">
          <br>
          <h6 class="section-label mx-1 mt-2">
            Google Maps Location
          </h6>
        </b-col>
        <b-col
          cols="12"
          class="mt-1 mb-2"
        >
          <GmapMap
            ref="mapRef"
            :center="center"
            :zoom="18"
            map-style-id="roadmap"
            :options="mapOptions"
            style="width: auto; height: 50vmin"
          >
            <GmapMarker
              :position="marker.position"
              :clickable="true"
              :draggable="false"
            />
          </GmapMap>

        <!--        <p>Selected Position: {{ marker.position }}</p>-->
        </b-col>
      <!--/ application switch -->
      </template>
      <!-- buttons -->
      <b-col cols="12">
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="mr-1 mt-1"
          @click="submitForm"
        >
          Save changes
        </b-button>
        <b-button
          v-ripple.400="'rgba(186, 191, 199, 0.15)'"
          type="reset"
          class="mt-1"
          variant="outline-secondary"
        >
          Cancel
        </b-button>
      </b-col>
      <!--/ buttons -->
    </b-row>
  </b-card>
</template>

<script>
import {
  BButton, BRow, BCol, BCard, BFormInput, BFormGroup,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BFormGroup,
    BButton,
    BRow,
    BCol,
    BCard,
    BFormInput,
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
      locationSelected: false,
      vm: {
        searchPlace: '',
        location: {},
      },
      localOptions: JSON.parse(JSON.stringify(this.socialData)),
      currentPlace: null,
      marker: { position: { lat: 10, lng: 10 } },
      center: { lat: 10, lng: 10 },
      mapOptions: {
        disableDefaultUI: true,
      },
    }
  },
  mounted() {
    // console.log(this.localOptions)
    if ('gMapsBusinessLink' in this.localOptions && this.localOptions.gMapsBusinessLink && this.localOptions.gMapsBusinessLink !== '') {
      // eslint-disable-next-line radix
      this.marker.position.lat = this.localOptions.lat
      // eslint-disable-next-line radix
      this.marker.position.lng = this.localOptions.lon
      // eslint-disable-next-line radix
      this.center.lat = this.localOptions.lat
      // eslint-disable-next-line radix
      this.center.lng = this.localOptions.lon
      this.locationSelected = true
    }
    if (!('gMapsBusinessLink' in this.localOptions)) {
      this.localOptions.gMapsBusinessLink = ''
    }
    if (!('lat' in this.localOptions)) {
      this.localOptions.lat = ''
    }
    if (!('lon' in this.localOptions)) {
      this.localOptions.lon = ''
    }
  },
  methods: {
    // detects location from browser
    geolocate() {
      navigator.geolocation.getCurrentPosition(position => {
        this.marker.position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        this.panToMarker()
      })
    },
    // sets the position of marker when dragged
    handleMarkerDrag(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() }
    },
    // Moves the map view port to marker
    panToMarker() {
      this.$refs.mapRef.panTo(this.marker.position)
      this.$refs.mapRef.setZoom(18)
    },
    // Moves the marker to click position on the map
    handleMapClick(e) {
      this.marker.position = { lat: e.latLng.lat(), lng: e.latLng.lng() }
      // console.log(e)
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
      // console.log(values)
      this.loading = true
      await this.$apollo.mutate({
        mutation: gql`mutation ($id: bigint!, $link: String, $lat: float8, $lon: float8) {
         update_turf(where: {id: {_eq: $id}}, _set: { gMapsBusinessLink: $link, lat: $lat, lon: $lon }) {
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
            this.locationSelected = true
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
                  text: e.message,
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
            text: e.message,
            variant: 'danger',
          },
        })
        this.$router.go(-1)
      })
      this.loading = false
    },
    async submitForm() {
      if (this.localOptions.gMapsBusinessLink !== this.vm.location.url || this.localOptions.lat !== this.vm.location.geometry.location.lat || this.localOptions.lon !== this.vm.location.geometry.location.lng) {
        const data = {
          id: this.socialData.id,
          link: this.vm.location.url,
          lat: this.vm.location.geometry.location.lat(),
          lon: this.vm.location.geometry.location.lng(),
        }
        await this.updateTurfData(data)
        this.$emit('update', data)
      }
    },
  },
}
</script>
