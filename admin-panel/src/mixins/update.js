import Vue from 'vue'

export default {
  data() {
    return {
      // refresh variables
      refreshing: false,
      registration: null,
      updateExists: false,
    }
  },

  created() {
    // Listen for our custom event from the SW registration
    document.addEventListener('swUpdated', this.updateAvailable, { once: true })

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (this.refreshing) return
      this.refreshing = true
      // Here the actual reload of the page occurs
      window.location.reload()
    })
  },

  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event) {
      const vm = this
      Vue.swal('Hello Vue world!!!')
      Vue.swal({
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
          vm.refreshApp()
          Vue.swal({
            icon: 'success',
            title: 'Hurray!',
            text: 'Upturf will be updated.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        } else if (result.dismiss === 'cancel') {
          Vue.swal({
            title: 'Update soon!',
            text: 'Get the latest features with the update :)',
            icon: 'error',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
        }
      })
      this.registration = event.detail
      this.updateExists = true
    },

    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return
      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    },
  },
}
