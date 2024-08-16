import { type Router } from 'vue-router'
import { baseRouterConfig } from './base'

const modules = import.meta.glob([
  '@/views/**/*.vue',
  '@/views/**/config.ts',
  '!@/views/**/component/**/*.vue',
  '!@/views/**/component/**/config.ts',
])
interface PNRouter {
  path: string
  name: string
}
const getName = (path: string): PNRouter => {
  const ids = path.split('/src/views/')[1].split('/')
  if (ids[ids.length - 1] === 'index.vue') {
    ids.pop()
  }
  let pStr = ''
  let nStr = ''
  ids.forEach(el => {
    pStr += `/${el}`
    nStr += el.charAt(0).toUpperCase() + el.slice(1)
  })
  return { path: pStr, name: nStr }
}

export const genRoutes = async () => {
  const menu: any = []
  const tRoutes: any = []
  const componentMods: any[] = []  //组件信息
  const configMods: any[] = []  // 配置文件信息
  for (const k in modules) {
    const mod = (await modules[k]()) as any
    if (!mod.default?.config) {
      componentMods.push(mod)
    } else {
      configMods.push(mod)
    }
  }
  for (const mod of componentMods) {
    const { __file } = mod.default
    const { name, path } = getName(__file) // 获取文件名
    const config = configMods.find(c => c.default?.config.name === name)
    tRoutes.push({
      name,
      path,
      component: mod.default,
      meta: {
        ...config?.default?.config
      }
    })
  }

  const pathMap: { [key: string]: any } = {}
  const firstFloor = tRoutes.filter((el: any) => el.path.lastIndexOf('/') === 0)
  firstFloor.forEach((el: any) => {
    const tk = el.path.substring(1)
    const k = tk.charAt(0).toUpperCase() + tk.slice(1)
    pathMap[k] = {
      ...el,
      name: k,
      children: [],
    }
  })
  tRoutes
    .filter((el: any) => el.path.lastIndexOf('/') !== 0)
    .forEach((el: any) => {
      let paths = el.path.split('/')
      paths.shift()
      const tPaths = paths.map(
        (p: string) => p.charAt(0).toUpperCase() + p.slice(1)
      )
      for (let i = 1; i < paths?.length; i++) {
        const pk = tPaths.slice(0, i + 1).join('')
        const tpk = tPaths.slice(0, i).join('')
        const p = paths.slice(0, i + 1).join('/')
        if (!pathMap[pk]) {
          pathMap[pk] = {
            path: `/${p}`,
            name: pk,
            children: [],
          }
        }
        const eIdx = pathMap[tpk].children.findIndex(
          //@ts-ignore
          el => el.name === pathMap[pk].name
        )
        if (eIdx < 0) {
          pathMap[tpk].children.push(pathMap[pk])
        }
        if (i === paths.length - 1) {
          pathMap[pk].component = el.component
        }
      }
    })
  firstFloor
    .map((el: any) => el.name)
    .forEach((k: string) => {
      menu.push(pathMap[k])
    })
  return new Promise(res =>
    res({ routes: [...baseRouterConfig, ...tRoutes], menu })
  )
}

export const routerGuard = (router: Router) => {
  router.beforeEach((to, _from, next) => {
    console.log('全局的路由守卫', to)
    if (to.meta.title) {
      // @ts-ignore
      document.title = to.meta.title
    }
    next()
  })
}
