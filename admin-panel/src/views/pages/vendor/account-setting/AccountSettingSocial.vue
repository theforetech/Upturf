<template>
  <b-card>
    <b-form>
      <b-row>
        <b-col
          cols="12"
          class="mt-1"
        >
          <div class="d-flex align-items-center mb-3">
            <feather-icon
              icon="UserIcon"
              size="18"
            />
            <h4 class="mb-0 ml-75">
              Profile Connections <span style="color: gray; font-size: 0.9rem">(for faster sign-in)</span>
            </h4>
          </div>
          <b-row class="text-center">
            <!-- twitter profile -->
            <b-col
              md="3"
              cols="6"
              class="mb-1"
            >
              <b-card-text class="font-weight-bold">
                Your Twitter
              </b-card-text>
              <div class="mb-1">
                <b-avatar
                  size="40"
                  :src="localOptions.connections.twitter.profileImg"
                />
              </div>
              <b-card-text class="mb-0">
                @{{ localOptions.connections.twitter.id }}
              </b-card-text>
              <b-link>
                Disconnect
              </b-link>
            </b-col>
            <!--/ twitter profile -->

            <!-- facebook connect button -->
            <b-col
              md="3"
              cols="6"
              class="mb-1"
            >
              <b-card-text class="font-weight-bold mb-2">
                Your Facebook
              </b-card-text>
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
              >
                Connect
              </b-button>
            </b-col>
            <!--/ facebook connect button -->

            <!-- google profile -->
            <b-col
              md="3"
              cols="6"
              class="mb-1"
            >
              <b-card-text class="font-weight-bold">
                Your Google
              </b-card-text>
              <div class="mb-1">
                <b-avatar
                  size="40"
                  :src="localOptions.connections.google.profileImg"
                />
              </div>
              <b-card-text class="mb-0">
                @{{ localOptions.connections.google.id }}
              </b-card-text>
              <b-link>
                Disconnect
              </b-link>
            </b-col>
            <!--/ google profile -->

            <!-- github connect -->
            <b-col
              md="3"
              cols="6"
              class="mb-1"
            >
              <b-card-text class="font-weight-bold mb-2">
                Your GitHub
              </b-card-text>
              <b-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="outline-primary"
              >
                Connect
              </b-button>
            </b-col>
            <!--/ github connect -->
          </b-row>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import {
  BButton, BForm, BRow, BCol, BCard, BCardText, BLink, BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'

export default {
  components: {
    BButton,
    BForm,
    BRow,
    BCol,
    BCard,
    BCardText,
    BLink,
    BAvatar,
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
      localOptions: JSON.parse(JSON.stringify(this.socialData)),
    }
  },
  methods: {
    resetForm() {
      this.localOptions = JSON.parse(JSON.stringify(this.socialData))
    },
  },
}
</script>
