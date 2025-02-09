import { createStore } from 'vuex'

// Create a new store instance.
export default createStore({
  state () {
    return {
      showConfirmation: false
    }
  },
  mutations: {
    updateShowConfirmation (state, shouldShow) {
      state.showConfirmation = shouldShow
    }
  },
  actions: {
    updateShowConfirmation({ commit }, shouldShow) {
      commit('updateShowConfirmation', shouldShow)
    }
  }
})