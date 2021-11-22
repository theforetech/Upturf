<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
    :style="{overflow:(overflowVal)? 'hidden': 'visible'}"
  >
    <component :is="layout">
      <router-view />
    </component>
    <div
      class="overlay-dark"
      :class="{'open-overlay':isOpen}"
    />
    <scroll-to-top v-if="enableScrollToTop" />
    <PWAPrompt />
  </div>
</template>

<script>
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig'
import { provideToast } from 'vue-toastification/composition'
import { watch } from '@vue/composition-api'
import useAppConfig from '@core/app-config/useAppConfig'
import PWAPrompt from 'vue2-ios-pwa-prompt'

import { useWindowSize, useCssVar } from '@vueuse/core'
import { mapGetters } from 'vuex'
import update from '@/mixins/update'
import store from '@/store'

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {
    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,
    PWAPrompt,

    ScrollToTop,
  },
  mixins: [update],
  watch: {
    updateExists(oldVal, newVal) {
      if (!oldVal && newVal) {
        this.$swal({
          title: 'New Update Available!',
          text: 'Do you want to get it now?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Update!',
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ml-1',
          },
          buttonsStyling: false,
        }).then(result => {
          if (result.value) {
            this.refreshApp()
            this.$swal({
              icon: 'success',
              title: 'Hurray!',
              text: 'Upturf will be updated.',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            })
          } else if (result.dismiss === 'cancel') {
            this.$swal({
              title: 'Update soon!',
              text: 'Get the latest features with the update :)',
              icon: 'error',
              customClass: {
                confirmButton: 'btn btn-success',
              },
            })
          }
        })
      }
    },
  },
  mounted() {
    if (this.updateExists) {
      this.$swal({
        title: 'New Update Available!',
        text: 'Do you want to get it now?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Update!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.refreshApp()
          this.$swal({
            icon: 'success',
            title: 'Hurray!',
            text: 'Upturf will be updated.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        } else if (result.dismiss === 'cancel') {
          this.$swal({
            title: 'Update soon!',
            text: 'Get the latest features with the update :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        }
      })
    }
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
    ...mapGetters({ overflowVal: 'app/overflowHidden' }),
  },
  beforeCreate() {
    // Set colors in theme
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  },
  setup() {
    const { skin, skinClasses } = useAppConfig()
    const { enableScrollToTop } = $themeConfig.layout

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    return {
      skinClasses,
      enableScrollToTop,
    }
  },
}
</script>
<style>
html{
  font-family:"Montserrat";
}
</style>
