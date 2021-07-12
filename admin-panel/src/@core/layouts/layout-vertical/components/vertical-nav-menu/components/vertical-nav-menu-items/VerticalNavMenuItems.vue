<template>
  <ul>
    <component
      :is="resolveNavItemComponent(item)"
      v-for="item in roleItems"
      :key="item.header || item.title"
      :item="item"
    />
  </ul>
</template>

<script>
import { resolveVerticalNavMenuItemComponent as resolveNavItemComponent } from '@core/layouts/utils'
import { provide, ref } from '@vue/composition-api'
import VerticalNavMenuHeader from '../vertical-nav-menu-header'
import VerticalNavMenuLink from '../vertical-nav-menu-link/VerticalNavMenuLink.vue'
import VerticalNavMenuGroup from '../vertical-nav-menu-group/VerticalNavMenuGroup.vue'

export default {
  components: {
    VerticalNavMenuHeader,
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    roleItems() {
      return this.items.filter(item => item.role === this.$store.state.user.AppActiveUser.role)
    },
  },
  setup() {
    provide('openGroups', ref([]))

    return {
      resolveNavItemComponent,
    }
  },
}
</script>
