<template>
  <div
    class="vertical-layout h-100"
    :class="[layoutClasses]"
    :data-col="isNavMenuHidden ? '1-column' : null"
  >
    <!-- Navbar -->
    <b-navbar
      :toggleable="false"
      :variant="navbarBackgroundColor"
      class="header-navbar navbar navbar-shadow align-items-center"
      :class="[navbarTypeClass]"
    >
      <slot
        name="navbar"
        :toggleVerticalMenuActive="toggleVerticalMenuActive"
        :navbarBackgroundColor="navbarBackgroundColor"
        :navbarTypeClass="[...navbarTypeClass, 'header-navbar navbar navbar-shadow align-items-center']"
      >
        <app-navbar-vertical-layout :toggle-vertical-menu-active="toggleVerticalMenuActive" />
      </slot>
    </b-navbar>
    <!--/ Navbar -->

    <!-- Vertical Nav Menu -->
    <vertical-nav-menu
      v-if="!isNavMenuHidden"
      :is-vertical-menu-active="isVerticalMenuActive"
      :toggle-vertical-menu-active="toggleVerticalMenuActive"
    >
      <template #header="slotProps">
        <slot
          name="vertical-menu-header"
          v-bind="slotProps"
        />
      </template>
    </vertical-nav-menu>
    <!-- /Vertical Nav Menu -->

    <!-- Vertical Nav Menu Overlay -->
    <div
      class="sidenav-overlay"
      :class="overlayClasses"
      @click="isVerticalMenuActive = false"
    />
    <!-- /Vertical Nav Menu Overlay -->

    <!-- Content -->

    <!-- CONTENT TYPE: Left -->
    <transition
      :name="routerTransition"
      mode="out-in"
    >
      <component
        :is="layoutContentRenderer"
        :key="layoutContentRenderer === 'layout-content-renderer-left' ? $route.meta.navActiveLink || $route.name : null"
      >
        <template
          v-for="(index, name) in $scopedSlots"
          v-slot:[name]="data"
        >
          <slot
            :name="name"
            v-bind="data"
          />
        </template>
      </component>
    </transition>
    <!--/ Content -->
    <!-- Footer -->
    <footer
      class="footer footer-light"
      :class="[footerTypeClass]"
    >
      <slot name="footer">
        <app-footer />
      </slot>
    </footer>
    <!-- /Footer -->
    <b-navbar
      variant="faded"
      type="dark"
      fixed="bottom"
      class="appbar"
    >
      <b-row
        cols="5"
        cols-sm="5"
        cols-md="5"
        cols-lg="5"
      >
        <b-col
          v-for="x in navbarItems"
          :key="x.name"
          class="pr-1"
        >
          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
            class="btn-icon rounded-circle w-100"
          >
            <feather-icon
              :icon="x.icon"
              size="24"
              class="feather-icon"
            />
            <span class="btn-name">
              {{ x.name }}
            </span>
          </b-button>
        </b-col>
      </b-row>

    </b-navbar>

    <slot name="customizer" />
  </div>
</template>
<style scoped>
.appbar{
  background-color: #FCFCFC;
  height: 6rem;
  box-shadow: 0 -5px 5px -5px rgba(0,0,0,0.3);
}
.btn-icon{
  height: 6rem;
  width: 6rem;
  border: transparent solid 1px!important;
  padding: 0!important;
}
.feather-icon{
  margin-bottom: 0.7rem;
}
.btn-name{
  font-size: 0.8rem;
  text-align: center;
}

</style>

<script>
import { onUnmounted } from '@vue/composition-api'
import AppNavbarVerticalLayout from '@core/layouts/components/app-navbar/AppNavbarVerticalLayout.vue'
import AppFooter from '@core/layouts/components/AppFooter.vue'
import useAppConfig from '@core/app-config/useAppConfig'
import {
  BNavbar, BButton, BCol, BRow,
} from 'bootstrap-vue'
import LayoutContentRendererDefault from '@core/layouts/components/layout-content-renderer/LayoutContentRendererDefault.vue'
import LayoutContentRendererLeft from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeft.vue'
import LayoutContentRendererLeftDetached from '@core/layouts/components/layout-content-renderer/LayoutContentRendererLeftDetached.vue'
import Ripple from 'vue-ripple-directive'
import VerticalNavMenu from './components/vertical-nav-menu/VerticalNavMenu.vue'
import useVerticalLayout from './useVerticalLayout'
import mixinVerticalLayout from './mixinVerticalLayout'

export default {
  components: {
    // AppBreadcrumb,
    AppNavbarVerticalLayout,
    AppFooter,
    VerticalNavMenu,
    BNavbar,
    BButton,
    BRow,
    BCol,
    LayoutContentRendererLeftDetached,
    LayoutContentRendererLeft,
    LayoutContentRendererDefault,
  },
  directives: {
    Ripple,
  },
  mixins: [mixinVerticalLayout],
  computed: {
    layoutContentRenderer() {
      const rendererType = this.$route.meta.contentRenderer
      if (rendererType === 'sidebar-left') return 'layout-content-renderer-left'
      if (rendererType === 'sidebar-left-detached') return 'layout-content-renderer-left-detached'
      return 'layout-content-renderer-default'
    },
  },
  setup() {
    const {
      routerTransition, navbarBackgroundColor, navbarType, footerType, isNavMenuHidden,
    } = useAppConfig()

    const {
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      layoutClasses,
      overlayClasses,
      resizeHandler,
      navbarTypeClass,
      footerTypeClass,
    } = useVerticalLayout(navbarType, footerType)

    // Resize handler
    resizeHandler()
    window.addEventListener('resize', resizeHandler)
    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })

    return {
      navbarItems: [
        {
          name: 'Explore',
          icon: 'SearchIcon',
        },
        {
          name: 'Wishlist',
          icon: 'HeartIcon',
        },
        {
          name: 'Turfs',
          icon: 'DribbbleIcon',
        },
        {
          name: 'Bookings',
          icon: 'BookIcon',
        },
        {
          name: 'Profile',
          icon: 'UserIcon',
        },
      ],
      isVerticalMenuActive,
      toggleVerticalMenuActive,
      isVerticalMenuCollapsed,
      overlayClasses,
      layoutClasses,
      navbarTypeClass,
      footerTypeClass,

      // App Config
      routerTransition,
      navbarBackgroundColor,
      isNavMenuHidden,
    }
  },
}
</script>
