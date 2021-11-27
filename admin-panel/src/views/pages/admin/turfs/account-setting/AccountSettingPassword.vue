<template>
  <b-card>
    <div
      v-if="!loading"
      style="display: flex; flex-flow: row wrap; width: 100%;"
    >
      <div
        v-for="x in images"
        :key="x.id"
        class="hvrbox"
      >
        <img
          class="image-turf"
          :src="x.url"
        >
        <div class="hvrbox-layer_top">
          <div class="hvrbox-text">
            <b-button
              variant="gradient-danger"
              class="btn-icon rounded-circle"
              @click="deleteImage(x.id)"
            >
              <feather-icon icon="Trash2Icon" />
            </b-button>
          </div>
        </div>
      </div>
      <div
        v-if="images.length < 5"
        style="box-sizing: border-box;position: relative; display: inline-block; overflow: hidden;"
      >
        <b-form-file
          v-show="false"
          id="uploadFile"
          ref="file-input"
          v-model="file"
          accept="image/jpeg, image/png"
          @input="uploadImage"
        />
        <div
          class="image-turf"
          style="background: #fff0f8; box-shadow: inset  2px 2px 12px rgba(0,0,0,0.2); cursor: pointer;"
          @click="addImage()"
        >
          <feather-icon
            style="margin: 0; position: absolute; top: 50%; transform: translateY(-50%) translateX(-50%); left:50%"
            size="40"
            icon="PlusIcon"
          />
        </div>
      </div>
    </div>
    <b-card v-else>
      <b-skeleton
        animation="throb"
        width="85%"
      />
      <b-skeleton
        animation="throb"
        width="55%"
      />
      <b-skeleton
        animation="throb"
        width="70%"
      />
    </b-card>
  </b-card>
</template>

<script>
import {
  BCard, BButton, BFormFile, BSkeleton,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import gql from 'graphql-tag'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BCard,
    BButton,
    BFormFile,
    BSkeleton,
  },
  directives: {
    Ripple,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['turfid'],
  data() {
    return {
      images: [],
      file: null,
      loading: true,
    }
  },
  computed: {
  },
  mounted() {
    this.getTurfImages()
  },
  methods: {
    async getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    },
    addImage() {
      document.getElementById('uploadFile').click()
    },
    async uploadImage(file) {
      this.loading = true
      const fileData2 = await this.getBase64(file)
      const fileData = fileData2.split('base64,')[1]
      await this.$apollo.mutate({
        mutation: gql`mutation test($id: bigint, $base64str: String!, $name: String!, $type: String!) {
          uploadFile(base64str: $base64str, name: $name, type: $type, turfID: $id) {
            url,
            id
          }
        }`,
        variables: {
          base64str: fileData,
          id: this.turfid,
          name: file.name,
          type: file.type,
        },
        update: async (cache, { data: { uploadFile } }) => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query ($turfid: bigint!) {
                images(where: {turf_id: {_eq: $turfid}}) {
                  id
                  url
                }
              }`,
              variables: {
                turfid: this.turfid,
              },
            })
            data.images.push({
              id: uploadFile.id,
              url: uploadFile.url,
            })
            await cache.writeQuery({
              query: gql`query ($turfid: bigint!) {
                images(where: {turf_id: {_eq: $turfid}}) {
                  id
                  url
                }
              }`,
              variables: {
                turfid: this.turfid,
              },
              data,
            })
            await this.getTurfImages()
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Added image successfully!',
                variant: 'success',
              },
            })
            this.loading = false
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error adding image',
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
            this.loading = false
          }
        },
      })
    },
    async deleteImage(id) {
      this.loading = true
      await this.$apollo.mutate({
        mutation: gql`mutation ($id: bigint!) {
          delete_images_by_pk(id: $id) {
            id
          }
        }`,
        variables: {
          id,
        },
        update: async cache => {
          // Read the data from our cache for this query.
          try {
            const data = await cache.readQuery({
              query: gql`query ($turfid: bigint!) {
                images(where: {turf_id: {_eq: $turfid}}) {
                  id
                  url
                }
              }`,
              variables: {
                turfid: this.turfid,
              },
            })
            data.images = data.images.filter(image => {
              if (image.id === id) {
                return false
              }
              return true
            })
            await cache.writeQuery({
              query: gql`query ($turfid: bigint!) {
                images(where: {turf_id: {_eq: $turfid}}) {
                  id
                  url
                }
              }`,
              variables: {
                turfid: this.turfid,
              },
              data,
            })
            await this.getTurfImages()
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Success',
                icon: 'CheckIcon',
                text: 'Deleted image successfully!',
                variant: 'success',
              },
            })
          } catch (e) {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: 'Error deleting image',
                icon: 'XCircleIcon',
                text: e,
                variant: 'danger',
              },
            })
          }
        },
      }).catch(e => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Error deleting image',
            icon: 'XCircleIcon',
            text: e,
            variant: 'danger',
          },
        })
        this.$router.go(-1)
      })

      this.loading = false
    },
    async getTurfImages() {
      this.loading = true
      const result = await this.$apollo.query({
        query: gql`query ($turfid: bigint!) {
          images(where: {turf_id: {_eq: $turfid}}) {
            id
            url
          }
        }`,
        variables: {
          turfid: this.turfid,
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
      this.images = result.data.images
    },
  },
}
</script>

<style>
.image-turf {
  width: 200px;  /* Or whatever */
  height: 200px; /* Or whatever */
  margin: 10px;
  border-radius: 25px;
}
.hvrbox,
.hvrbox * {
  box-sizing: border-box;
}
.hvrbox {
  position: relative;
  display: inline-block;
  overflow: hidden;
  max-width: 100%;
  height: auto;
}
.hvrbox img {
  max-width: 100%;
}
.hvrbox .hvrbox-layer_bottom {
  display: block;
}
.hvrbox .hvrbox-layer_top {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 25px;
  right: 0;
  bottom: 0;
  width: 200px;  /* Or whatever */
  height: 200px; /* Or whatever */
  margin: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 15px;
  -moz-transition: all 0.4s ease-in-out 0s;
  -webkit-transition: all 0.4s ease-in-out 0s;
  -ms-transition: all 0.4s ease-in-out 0s;
  transition: all 0.4s ease-in-out 0s;
}
.hvrbox:hover .hvrbox-layer_top,
.hvrbox.active .hvrbox-layer_top {
  opacity: 1;
}
.hvrbox .hvrbox-text {
  text-align: center;
  font-size: 18px;
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  -moz-transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.hvrbox .hvrbox-text_mobile {
  font-size: 15px;
  border-top: 1px solid rgb(179, 179, 179); /* for old browsers */
  border-top: 1px solid rgba(179, 179, 179, 0.7);
  margin-top: 5px;
  padding-top: 2px;
  display: none;
}
.hvrbox.active .hvrbox-text_mobile {
  display: block;
}
</style>
