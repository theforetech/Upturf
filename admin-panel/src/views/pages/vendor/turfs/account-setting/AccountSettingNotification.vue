<template>
  <b-card>
    <b-row>
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

      <!-- application switch -->
      <b-col sm="12">
        <br>
        <h6 class="section-label mx-1 mt-2">
          Google Maps Location
        </h6>
      </b-col>
      <b-col
        v-if="locationSelected"
        cols="12"
        class="mt-1 mb-2"
      >
        <GmapMap
          ref="mapRef"
          :center="center"
          :zoom="18"
          map-style-id="roadmap"
          :options="mapOptions"
          style="width: 100vmin; height: 50vmin"
        >
          <GmapMarker
            :position="marker.position"
            :clickable="true"
            :draggable="true"
          />
        </GmapMap>

        <!--        <p>Selected Position: {{ marker.position }}</p>-->
      </b-col>
      <!--/ application switch -->

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
  BButton, BRow, BCol, BCard, BFormInput,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
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
    notificationData: {
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
      localOptions: JSON.parse(JSON.stringify(this.notificationData)),
      currentPlace: null,
      marker: { position: { lat: 10, lng: 10 } },
      center: { lat: 10, lng: 10 },
      mapOptions: {
        disableDefaultUI: true,
      },
    }
  },
  mounted() {
    if ('gMapsBusinessLink' in this.localOptions && this.localOptions.gMapsBusinessLink && this.localOptions.gMapsBusinessLink !== '') {
      // eslint-disable-next-line radix
      this.marker.position.lat = parseInt(this.localOptions.gMapsLat)
      // eslint-disable-next-line radix
      this.marker.position.lon = parseInt(this.localOptions.gMapsLon)
      // eslint-disable-next-line radix
      this.center.lat = parseInt(this.localOptions.gMapsLat)
      // eslint-disable-next-line radix
      this.center.lon = parseInt(this.localOptions.gMapsLon)
      this.locationSelected = true
    }
    if (!('gMapsBusinessLink' in this.localOptions)) {
      this.localOptions.gMapsBusinessLink = ''
    }
    if (!('gMapsLat' in this.localOptions)) {
      this.localOptions.gMapsLat = ''
    }
    if (!('gMapsLon' in this.localOptions)) {
      this.localOptions.gMapsLon = ''
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
      console.log(e)
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
        mutation: gql`mutation ($id: bigint!, $link: String, $lat: String, $lon: String) {
         update_turf(where: {id: {_eq: $id}}, _set: { gMapsBusinessLink: $link, gMapsLat: $lat, gMapsLon: $lon }) {
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
      if (this.localOptions.gMapsBusinessLink !== this.vm.location.gMapsBusinessLink || this.localOptions.gMapsLat !== this.vm.location.gMapsLat || this.localOptions.gMapsLon !== this.vm.location.gMapsLon) {
        const data = {
          id: this.socialData.id,
          gMapsBusinessLink: this.localOptions.gMapsBusinessLink || null,
          gMapsLat: this.localOptions.gMapsLat || null,
          gMapsLon: this.localOptions.gMapsLon || null,
        }
        await this.updateTurfData(data)
        this.$emit('update', data)
      }
    },
  },
}
</script>
