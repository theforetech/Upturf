<template>
  <b-row>
    <b-col cols="12">
      <good-table-column-search />
    </b-col>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'
import GoodTableColumnSearch from './GoodTableColumnSearch.vue'

export default {
  components: {
    BRow,
    BCol,
    GoodTableColumnSearch,

  },
}
</script>

<style lang="scss" >
@import '@core/scss/vue/libs/vue-good-table.scss';
</style>
