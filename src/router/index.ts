import { type Router, type RouteRecordRaw } from 'vue-router'
import { baseRouterConfig } from './base'
import {
  getFileName,
  findFirstPage,
  gMenu,
  buildRouterTree,
} from '@/utils/router'

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
  const gRouter: any[] = []
  const routerMap: {[key: string]: any} = {}
  tRoutes.forEach((el: any) => { 
    routerMap[el.name] = { ...el, children: [] }
  })
  tRoutes.forEach((el: any) => {
    let paths = el.path.split('/')
    paths.shift()
    const tPaths = paths.map(
      (p: string) => p.charAt(0).toUpperCase() + p.slice(1)
    )
    if (paths.length === 1) {
      gRouter.push({ ...el, children: [] })
    } else {
      for (let i = 1; i < paths?.length; i++) {
        const pk = tPaths.slice(0, i + 1).join('') // 拼凑出原始 name
        const tpk = tPaths.slice(0, i).join('') // 父级节点 name，用来标记层级结构
        const p = paths.slice(0, i + 1).join('/') // 拼凑路由
        if (!routerMap[tpk]) {
          // 父级节点不存在，则构建
          const gConfig = configMods.find(c => c.default?.config.name === tpk)
          const fRoute = {
            path: `/${paths.slice(0, i).join('/')}`,
            name: tpk,
            meta: gConfig.default?.config,
            children: [],
          }
          routerMap[tpk] = fRoute
          gRouter.push(fRoute)
        }
        const gConfig = configMods.find(c => c.default?.config.name === pk) // 菜单组的配置文件
        let meta = el?.meta
        if (gConfig) meta = gConfig.default?.config
        const mRoute: any = {
          path: `/${p}`,
          name: pk,
          meta: {
            ...meta,
            preGroup: tpk,
          },
          children: [],
        }
        if (i === paths.length - 1) {
          mRoute.component = el.component
          gRouter.push(mRoute)
        }
      }
    }
  })
  const routerTree = buildRouterTree(gRouter)
  const menu: Array<RouteRecordRaw> = [] // 菜单信息存放数组
  gMenu(routerTree, menu)
  const fPage = findFirstPage(menu)
  return new Promise(res =>
    res({
      routes: [
        {
          path: '/',
          redirect: () => {
            return { path: fPage.path }
          },
        },
        ...baseRouterConfig,
        ...tRoutes,
      ],
      menu,
    })
  )
}
export const routerGuard = (router: Router) => {
  router.beforeEach((to, from, next) => {
    console.log('全局的路由守卫', from, to)
    if (to.meta.title) {
      // @ts-ignore
      document.title = to.meta.title
    }
    next();
  })
}
