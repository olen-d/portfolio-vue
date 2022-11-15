import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      currentJWT: '',
      now: new Date(),
      doLogout: false,
      loginPage: false,
      signupPage: false
    }
  },

  getters: {
    jwtData (state) {
      return state.currentJWT ? JSON.parse(atob(state.currentJWT.split(".")[1])) : null
    },
    administrator (state) {
      return this.jwtData ? this.jwtData.administrator : null
    },
    authorized (state) {
      const curTime = Math.floor(state.now.getTime() / 1000)
      if (this.jwtData && curTime < this.jwtData.exp) {
        return true
      } else {
        return false
      }
    },
    firstName (state) {
      return this.jwtData ? this.jwtData.firstName : null
    },
    username (state) {
      return this.jwtData ? this.jwtData.username : null
    }
  },

  actions: {
    async fetchJWT() {
      const res = localStorage.getItem('user_token')
      this.currentJWT = res
    },
    start() {
      this.now = new Date() + 1000 * 60
    }
  }
})
