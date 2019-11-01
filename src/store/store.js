import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    currentJWT: "",
    now: new Date(),
    doLogout: false,
    loginPage: false,
    signupPage: false,
    statusCategory: "",
    statusMessage: "",
    statusAction: ""
  },

  mutations: {
    setJWT(state, jwt) {
      state.currentJWT = jwt;
    },

    setNow(state) {
      state.now = new Date();
    },

    setDoLogout(state, doLogout) {
      state.doLogout = doLogout;
    },

    setLoginPage(state, loginPage) {
      state.loginPage = loginPage;
    },

    setSignupPage(state, signupPage) {
      state.signupPage = signupPage;
    },

    setStatusCategory(state, statusCategory) {
      state.statusCategory = statusCategory;
    },

    setStatusIcon(state, statusIcon) {
      state.statusIcon = statusIcon;
    },

    setStatusMessage(state, statusMessage) {
      state.statusMessage = statusMessage;
    },

    setStatusAction(state, statusAction) {
      state.statusAction = statusAction;
    }
  },

  getters: {
    jwt: state => state.currentJWT,
    jwtData: (state, getters) =>
      state.currentJWT ? JSON.parse(atob(getters.jwt.split(".")[1])) : null,
    userId: (state, getters) => (getters.jwtData ? getters.jwtData._id : null),
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
    expiration: (state, getters) =>
      getters.jwtData ? getters.jwtData.exp : null,
    now: state => state.now,
    authorized: (state, getters) => {
      const curTime = Math.floor(getters.now.getTime() / 1000);
      if (getters.jwtData && curTime < getters.jwtData.exp) {
        return true;
      } else {
        return false;
      }
    },
    doLogout: state => state.doLogout,
    loginPage: state => state.loginPage,
    signupPage: state => state.signupPage,
    statusCategory: state => state.statusCategory,
    statusIcon: state => state.statusIcon,
    statusMessage: state => state.statusMessage,
    statusAction: state => state.statusAction
  },

  actions: {
    async fetchJWT({ commit }) {
      const res = localStorage.getItem("user_token");
      commit("setJWT", res);
    },

    start({ commit }) {
      setInterval(() => {
        commit("setNow");
      }, 1000 * 60);
    },

    logout({ commit }) {
      commit("setJWT", "");
      commit("setDoLogout", false);
    }
  }
});
