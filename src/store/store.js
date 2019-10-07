import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentJWT: "",
    authorized: false,
    doLogout: false,
    loginPage: false,
    signupPage: false
  },

  mutations: {
    setJWT(state, jwt) {
      state.currentJWT = jwt;
    },

    setAuthorized(state, authorized) {
      state.authorized = authorized;
    },

    setDoLogout(state, doLogout) {
      state.doLogout = doLogout;
    },

    setLoginPage(state, loginPage) {
      state.loginPage = loginPage;
    },

    setSignupPage(state, signupPage) {
      state.signupPage = signupPage;
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
      getters.jwtData ? getters.jwtData.editor : null,
    authorized: state => state.authorized,
    doLogout: state => state.doLogout,
    loginPage: state => state.loginPage,
    signupPage: state => state.signupPage
  },

  actions: {
    async fetchJWT({ commit }) {
      const res = localStorage.getItem("user_token");
      commit("setJWT", res);
    },

    logout({ commit }) {
      commit("setJWT", "");
      commit("setAuthorized", false);
      commit("setDoLogout", false);
    }
  }
});
