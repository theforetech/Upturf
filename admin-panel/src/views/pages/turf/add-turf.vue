<template>
  <b-row>
    <b-col cols="10">
      <addTurfCard />
    </b-col>
  </b-row>
</template>

<script>
import {
  BRow, BCol,
} from 'bootstrap-vue'
import addTurfCard from '@/views/pages/components/forms/addTurfCard.vue'
/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,
    addTurfCard,
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
}
/* eslint-disable global-require */
</script>

<style>

</style>
