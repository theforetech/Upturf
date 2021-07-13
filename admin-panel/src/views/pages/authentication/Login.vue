<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <vuexy-logo />
        <h2 class="brand-text text-primary ml-1">
          Vuexy
        </h2>
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col
        lg="8"
        class="d-none d-lg-flex align-items-center p-5"
      >
        <div class="w-100 d-lg-flex align-items-center justify-content-center px-5">
          <b-img
            fluid
            :src="imgUrl"
            alt="Login V2"
          />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col
        lg="4"
        class="d-flex align-items-center auth-bg px-2 p-lg-5"
      >
        <b-col
          sm="8"
          md="6"
          lg="12"
          class="px-xl-2 mx-auto"
        >
          <b-card-title
            class="mb-1 font-weight-bold"
            title-tag="h2"
          >
            Welcome to Surf A Turf! 👋
          </b-card-title>
          <b-card-text class="mb-2">
            Please sign-in to your account and start the adventure
          </b-card-text>

          <b-alert
            variant="primary"
            show
          >
            <div class="alert-body font-small-2">
              <p>
                <small class="mr-50"><span class="font-weight-bold">Click below to login/signup</span></small>
              </p>
              <p>
                <small class="mr-50"><span class="font-weight-bold">Social login providers available</span></small>
              </p>
              <p>
                <small class="mr-50"><span class="font-weight-bold">OTP Verification on new registration</span></small>
              </p>
            </div>
            <feather-icon
              v-b-tooltip.hover.left="'You will be redirected to the authentication portal'"
              icon="HelpCircleIcon"
              size="18"
              class="position-absolute"
              style="top: 10; right: 10;"
            />
          </b-alert>

          <b-button
            variant="primary"
            block
            @click="loginAuth0"
          >
            Sign in
          </b-button>

          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link @click="loginAuth0">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>

          <!--          &lt;!&ndash; divider &ndash;&gt;-->
          <!--          <div class="divider my-2">-->
          <!--            <div class="divider-text">-->
          <!--              or-->
          <!--            </div>-->
          <!--          </div>-->

          <!--          &lt;!&ndash; social buttons &ndash;&gt;-->
          <!--          <div class="auth-footer-btn d-flex justify-content-center">-->
          <!--            <b-button-->
          <!--              variant="facebook"-->
          <!--              href="javascript:void(0)"-->
          <!--            >-->
          <!--              <feather-icon icon="FacebookIcon" />-->
          <!--            </b-button>-->
          <!--            <b-button-->
          <!--              variant="twitter"-->
          <!--              href="javascript:void(0)"-->
          <!--            >-->
          <!--              <feather-icon icon="TwitterIcon" />-->
          <!--            </b-button>-->
          <!--            <b-button-->
          <!--              variant="google"-->
          <!--              href="javascript:void(0)"-->
          <!--            >-->
          <!--              <feather-icon icon="MailIcon" />-->
          <!--            </b-button>-->
          <!--            <b-button-->
          <!--              variant="github"-->
          <!--              href="javascript:void(0)"-->
          <!--            >-->
          <!--              <feather-icon icon="GithubIcon" />-->
          <!--            </b-button>-->
          <!--          </div>-->
        </b-col>
      </b-col>
    <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import VuexyLogo from '@core/layouts/components/Logo.vue'
import {
  BRow, BCol, BLink, BCardText, BCardTitle, BImg, BButton, BAlert, VBTooltip,
} from 'bootstrap-vue'
import store from '@/store/index'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  directives: {
    'b-tooltip': VBTooltip,
  },
  components: {
    BRow,
    BCol,
    BLink,
    BCardText,
    BCardTitle,
    BImg,
    BButton,
    BAlert,
    VuexyLogo,
  },
  data() {
    return {
      sideImg: require('@/assets/images/pages/login-v2.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.sideImg = require('@/assets/images/pages/login-v2-dark.svg')
        return this.sideImg
      }
      return this.sideImg
    },
  },
  methods: {
    checkLogin() {
      // If user is already logged in notify
      if (this.$auth.isAuthenticated()) {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'You are already logged in!',
            icon: 'AlertIcon',
            variant: 'warning',
          },
        })
        this.$router.push(this.$route.query.redirect || getHomeRouteForLoggedInUser(this.$store.state.user.AppActiveUser.userRole))
        return false
      }
      return true
    },
    loginAuth0() {
      if (!this.checkLogin()) return
      if (this.$route.query.redirect) {
        this.$auth.login(this.$route.query.redirect)
        return
      }
      this.$auth.login('no-redirect')
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
