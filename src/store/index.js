import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    apiStationList: [],
    apiWellList: [],
    apiRoleList: []
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setApiStationList(state, payload) {
      state.apiStationList = payload
    },
    setApiWellList(state, payload) {
      state.apiWellList = payload
    },
    setApiRoleList(state, payload) {
      state.apiRoleList = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
