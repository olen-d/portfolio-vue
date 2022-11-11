import { defineStore } from 'pinia'

export const useStatusStore = defineStore('status', {
  state: () => {
    return {
      statusAction: '',
      statusCategory: '',
      statusMessage: ''
    }
  }
})
