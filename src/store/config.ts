import { defineStore } from "pinia";
import { type Router } from 'vue-router'

const initState: {menu: Array<Router>} = {
  menu: []
}
const useConfigStore = defineStore('config', {
  state: () => initState,
  getters: {},
  actions: {
    async updateMenus (val: any) {
      console.log('更新菜单', val)
      this.menu = val
    }
  }
})

export default useConfigStore