import { defineStore } from 'pinia'
import { type RouteRecordRaw, RouteRecordNameGeneric } from 'vue-router'

const initState: {
  menus: Array<RouteRecordRaw>
  activeMenuGroup?: RouteRecordRaw
} = {
  menus: [],
  activeMenuGroup: undefined,
}
const useConfigStore = defineStore('config', {
  state: () => initState,
  getters: {},
  actions: {
    async updateMenus(val: RouteRecordRaw[]) {
      this.menus = val
      this.updateActiveMenus(val[0]?.name)
    },
    async updateActiveMenus(val: RouteRecordNameGeneric) {
      const t = this.menus.find((el: RouteRecordRaw) => el.name === val)
      if(t) this.activeMenuGroup = t
    },
  },
})

export default useConfigStore
