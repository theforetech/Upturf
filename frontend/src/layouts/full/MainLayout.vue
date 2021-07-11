<template>
  <main-layout>
    <router-view />
  </main-layout>
</template>

<script>
import MainLayout from '@core/layouts/layout-full/MainLayout.vue'

export default {
  components: {
    MainLayout,
  },
}
</script>
