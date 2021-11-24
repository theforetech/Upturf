<template>
  <div style="">
    <div style="position:sticky;top:0;z-index: 2;overflow-x: hidden">
      <b-card
        no-body
        style="margin-bottom: 0.3rem;padding-bottom: 1rem;"
      >
        <b-card-header style="padding-left: 0;padding-bottom: 0.5rem;">
          <b-button
            v-ripple.200="'rgba(135, 135, 149 ,0.3)'"
            class="back"
            @click="navigateBack"
          >
            <feather-icon
              icon="ChevronLeftIcon"
              size="27"
              style="color: #1e1e1e;"
            />
          </b-button>
        </b-card-header>
        <b-card-body style="padding: 0;">
          <b-row style="padding-bottom: 1rem;">
            <b-col
              cols="7"
              style="padding-left:1.8rem;padding-right:0;line-height: 0.5; "
              align-self="end"
            >
              <h1 style="font-size: 1.4rem;font-weight: bolder">
                {{ firstName }}
              </h1>
              <h2 style="font-size: 0.8rem;">
                {{ userInfo.email }}
              </h2>
              <b-button
                v-ripple.200="'rgba(135, 135, 149 ,0.3)'"
                variant="flat-primary"
                style="padding:0px;font-size:0.9rem"
              >Your Activity ></b-button>
            </b-col>
            <b-col style="padding-right: 2rem">
              <b-avatar
                size="83"
                class="align-baseline profile"
                :src="userInfo.photoURL"
                variant="light-primary"
                style="float: right;"
              >
                <feather-icon
                  v-if="!userInfo.displayName"
                  icon="UserIcon"
                  size="22"
                />
              </b-avatar>
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </div>

    <div style="overflow-y: auto;overflow-x: hidden;height:100%;">
      <b-row style="height: 100%;">
        <b-col style="padding: 1rem 1rem 0rem 2rem;">
          <profile-card
            icon="HeartIcon"
            statistic="Wishlist"
            color="danger"
            @clicked="navigateTo('wishlist')"
          />
        </b-col>
        <b-col style="padding: 1rem 2rem 0rem 1rem;">
          <profile-card
            icon="ShoppingBagIcon"
            statistic="Bookings"
            color="success"
            @clicked="navigateTo('user-bookings')"
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col style="padding: 0rem 1rem 0rem 2rem;">
          <profile-card
            icon="BellIcon"
            statistic="Notifications"
            color="warning"
            @clicked="navigateTo('notifications')"
          />
        </b-col>
        <b-col style="padding: 0rem 2rem 0rem 1rem;">
          <profile-card
            icon="Edit2Icon"
            statistic="Update Profile"
            color="dark"
            @clicked="navigateTo('update-profile')"
          />
        </b-col>
      </b-row>
      <b-card>
        <b-card-header style="padding: 0rem;">
          <h2 style="font-size:1.2rem;color: #828282;letter-spacing: 3px;">
            ABOUT
          </h2>
        </b-card-header>
        <b-card-body style="padding: 0">
          <profile-card2
            statistic="Terms & Conditions"
            icon="FileTextIcon"
            color="dark"
            @clicked="navigateTo('terms')"
          />
          <profile-card2
            statistic="Cancellation & Refund Policy"
            icon="XOctagonIcon"
            color="dark"
            @clicked="navigateTo('cancelpolicy')"
          />
          <profile-card2
            statistic="Fair Usage Policy"
            icon="CodesandboxIcon"
            color="dark"
            @clicked="navigateTo('fairusage')"
          />
          <hr>
          <profile-card2
            statistic="Sign Out"
            icon="LogOutIcon"
            color="danger"
            class="signout"
            @clicked="logout"
          />
        </b-card-body>
      </b-card>
    </div>

  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BButton,
  BCardBody,
  BAvatar,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { mapGetters } from 'vuex'
import ProfileCard from './ProfileCard.vue'
import ProfileCard2 from './ProfileCard2.vue'

export default {
  components: {
    BCard,
    BButton,
    BCardHeader,
    BCardBody,
    // eslint-disable-next-line vue/no-unused-components
    BRow,
    // eslint-disable-next-line vue/no-unused-components
    BCol,
    BAvatar,
    ProfileCard,
    ProfileCard2,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      baseUserData: {
        name: 'Abhirup',
        emailId: 'abhirupcool2.ac@gmail.com',
      },

    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/getActiveUser',
      userProfile: 'user/getUserProfile',
    }),
    firstName() {
      if (this.userProfile.length > 0 && this.userProfile[0].name) return this.userProfile[0].name
      return this.userInfo.displayName.split(' ')[0]
    },
  },
  methods: {
    navigateBack() {
      this.$router.go(-1)
    },
    navigateTo(route) {
      this.$router.push({
        name: route,
      })
    },
    logout() {
      this.$auth.logout()
    },
  },
}
/* eslint-disable global-require */
</script>
<style scoped>
.back{
  background-color: transparent!important;
  border: none;
  box-shadow: none!important;
  font-size: 1.3rem;
  font-weight: bolder;
  padding-left:0.6rem ;
}
.signout{
  color: #EA5455;
  margin-top: 0;
  margin-bottom: 0;
}
[dir] .card .card {
  margin: 0;
  box-shadow: none !important;
}
</style>
<style lang="scss" >
@import '@core/scss/vue/pages/page-profile.scss';
</style>
