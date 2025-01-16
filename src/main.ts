import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { genRoutes, routerGuard } from './router'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import useConfigStore from './store/config'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import 'element-plus/dist/index.css'
const init = async () => {
  const app = createApp(App)
  const rRes = await genRoutes() as { routes: any, menu: any }
  const router = createRouter({
    history: createWebHashHistory(),
    routes: rRes.routes,
  })
  routerGuard(router)
  app.use(router)

  const store = createPinia()
  app.use(store)
  
  const configStore = useConfigStore()
  configStore.updateMenus(rRes.menu)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    if (key === 'Menu') app.component('IconMenu', component)
    else app.component(key, component)
  }
  app.mount('#app')
}
init()
