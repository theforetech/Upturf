import moment from 'moment'

export default {
  namespaced: true,
  state: {
    loading: false,
    location: JSON.parse(localStorage.getItem('location')) || null,
    searchQuery: '',
    turfs: [],
    sortBy: 'popularity', // popularity/ratingh2l/pricel2h/priceh2l
    date: moment().format('YYYY-MM-DD'),
    ratingFourPlus: false,
    amenities: [], // 'ac', 'indoor', 'clay-court', 'fully-sanitized'
    sports: [], // sport names
    timings: [], // 06-09, 09-12, 15-18, 18-21, 21-00
  },
  getters: {
    loading: state => state.loading,
    searchQuery: state => state.searchQuery,
    location: state => state.location,
    turfs: state => state.turfs,
    sortBy: state => state.sortBy,
    date: state => state.date,
    ratingFourPlus: state => state.ratingFourPlus,
    amenities: state => state.amenities,
    sports: state => state.sports,
    timings: state => state.timings,
  },
  mutations: {
    UPDATE_SEARCH(state, val) {
      state.searchQuery = val
    },
    UPDATE_SORT_BY(state, val) {
      state.sortBy = val
    },
    UPDATE_LOCATION(state, val) {
      state.location = val
      localStorage.setItem('location', JSON.stringify(val))
    },
    UPDATE_DATE(state, val) {
      state.date = val
    },
    TOGGLE_FOUR_PLUS(state) {
      state.ratingFourPlus = !state.ratingFourPlus
    },
    UPDATE_LOADING(state, val) {
      state.loading = val
    },
    UPDATE_AMENITIES(state, val) {
      state.amenities = val
    },
    UPDATE_TURFS(state, val) {
      state.turfs = val
    },
    UPDATE_SPORTS(state, val) {
      state.sports = val
    },
    UPDATE_TIMINGS(state, val) {
      state.timings = val
    },
  },
  actions: {
    // getTurfs({ commit, state }) {
    //   // commit('UPDATE_USER_INFO', payload)
    //
    // },
  },
}
