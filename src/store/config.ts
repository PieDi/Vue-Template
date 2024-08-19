import { defineStore } from 'pinia'
import { type RouteRecordRaw } from 'vue-router'

const initState: {
  menus: Array<RouteRecordRaw>
  activeMens: Array<RouteRecordRaw>
} = {
  menus: [],
  activeMens: [],
}
const useConfigStore = defineStore('config', {
  state: () => initState,
  getters: {},
  actions: {
    async updateMenus(val: RouteRecordRaw[]) {
      console.log('更新菜单', val)
      this.menus = val
      this.updateActiveMenus(val[0]?.name)
    },
    async updateActiveMenus(val: string) {
      const t = this.menus.find((el: RouteRecordRaw) => el.name === val)
      console.log('更新活跃菜单', t)
      if(t) this.activeMens = t
    },
  },
})

export default useConfigStore
