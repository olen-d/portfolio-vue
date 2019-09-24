import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentJWT: ""
  },

  mutations: {
    setJWT(state, jwt) {
      state.currentJWT = jwt;
    }
  },

  getters: {
    jwt: state => state.currentJWT,
    jwtData: (state, getters) =>
      state.currentJWT ? JSON.parse(atob(getters.jwt.split(".")[1])) : null,
    userId: (state, getters) =>
      getters.jwtData ? getters.jwtData.userId : null,
    userName: (state, getters) =>
      getters.jwtData ? getters.jwtData.userName : null,
    firstName: (state, getters) =>
      getters.jwtData ? getters.jwtData.firstName : null,
    lastName: (state, getters) =>
      getters.jwtData ? getters.jwtData.lastName : null,
    administrator: (state, getters) =>
      getters.jwtData ? getters.jwtData.administrator : null,
    editor: (state, getters) =>
      getters.jwtData ? getters.jwtData.editor : null
  },

  actions: {
    async fetchJWT({ commit }) {
      const res = await localStorage.getItem("user_token");
      commit("setJWT", await res.text());
    }
  }
});
