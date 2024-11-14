import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

//Intentionally left as a basic setup.
//Here we would add given store modules for now, its just a default value
export default new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
  actions: {
    increment({ commit }) {
      commit("increment");
    },
  },
  getters: {
    doubleCount: (state) => state.count * 2,
  },
});
