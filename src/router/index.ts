import { type Router, type RouteRecordRaw } from 'vue-router'
import { baseRouterConfig } from './base'
import { getFileName, findFirstPage, gMenu } from '@/utils/router'
const modules = import.meta.glob([
  '@/views/**/*.vue',
  '@/views/**/config.ts',
  '!@/views/**/component/**/*.vue',
  '!@/views/**/component/**/config.ts',
])


/**
 * 约定文件路由
 * views 文件夹下排除 component 会自动生成路由
 * 菜单和路由是对应的关系，考虑到并不是所有的路由都需要生成菜单，需要生成菜单的需要在同一目录下有唯一 config.ts 文件，因为作为菜单需要有 title 等一系列配置，如不需要切记勿添加 config.ts 文件，算是项目保留文件吧
 * 其中 config.ts  name 属性有一定要求，就是根据路径层级必须 大驼峰命名，入 /home/top/top1  =>  HomeTopTop1  这样做的目的是保持唯一性 对应路由中的 name 属性
 */
export const genRoutes = async () => {
  const tRoutes: Array<RouteRecordRaw> = [] // 路由信息存放数组
  const componentMods: any[] = [] //组件信息
  const configMods: any[] = [] // 配置文件信息
  for (const k in modules) {
    const mod = (await modules[k]()) as any
    if (!mod.default?.config) {
      componentMods.push(mod)
    } else {
      configMods.push(mod)
    }
  }
  // console.log(111, JSON.stringify(componentMods))
  // console.log(222, JSON.stringify(configMods))
  for (const mod of componentMods) {
    const { __file } = mod.default
    const { name, path } = getFileName(__file) // 获取文件名
    const config = configMods.find(c => c.default?.config.name === name)
    tRoutes.push({
      name,
      path,
      component: mod.default,
      meta: {
        ...config?.default?.config,
      },
    })
  }
  const ffModules = new Set  // 一级模块（菜单）
  tRoutes.map(el => { 
    if (el.name) { 
      //@ts-ignore
      const ns = el.name?.split(/(?=[A-Z])/)
      ffModules.add(ns[0] as string)
    }
  })
  const pathMap: { [key: string]: any } = {}
  const firstFloor = tRoutes.filter((el: any) => el.path.lastIndexOf('/') === 0)
  //@ts-ignore
  ffModules.forEach((k: string) => { 
    const t = tRoutes.find(el => el.name === k)
    if (t) { 
      pathMap[k] = {
        ...t,
        name: k,
        children: [],
      }
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
      for (let i = 1;i < paths?.length;i++) {
        // 拼凑出原始 name
        const pk = tPaths.slice(0, i + 1).join('')
        // 父级节点 name，用来标记层级结构
        const tpk = tPaths.slice(0, i).join('')
        // 拼凑路由
        const p = paths.slice(0, i + 1).join('/')
        if (!pathMap[pk]) {
          pathMap[pk] = {
            path: `/${p}`,
            name: pk,
            meta: el?.meta,
            children: [],
          }
        }
        const eIdx = pathMap[tpk]?.children?.findIndex(
          //@ts-ignore
          el => el.name === pk
        )
        if (eIdx < 0) {
          pathMap[tpk].children.push(pathMap[pk])
        }
      
        if (i === paths.length - 1) {
          pathMap[pk].component = el.component
        }
      }
    })

  const tMenu: Array<RouteRecordRaw> = [] // 菜单信息存放数组
  firstFloor
    .map((el: any) => el.name)
    .forEach((k: string) => {
      tMenu.push(pathMap[k])
    })
  const menu: Array<RouteRecordRaw> = [] // 菜单信息存放数组
  gMenu(tMenu, menu)
  const fPage = findFirstPage(menu)
  console.log('默认重定向第一个', fPage)
  return new Promise(res =>
    res({ routes: [{
      path: '/',
      redirect: () => {
        return { path: fPage.path}
      }
    }, ...baseRouterConfig, ...tRoutes], menu })
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
