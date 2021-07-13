export default {
  namespaced: true,
  state: {
    sports: [],
  },
  getters: {},
  mutations: {
    async UPDATE_SPORTS(state, payload) {
      state.sports = payload
    },
  },
  actions: {
    updateSports({ commit }, payload) {
      commit('UPDATE_SPORTS', payload)
    },
  },
}
