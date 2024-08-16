import { defineStore } from "pinia";

const useUserStore = defineStore('user', {
  state: () => ({name: '么么哒'}),
  getters: {},
  actions: {}
})

export default useUserStore