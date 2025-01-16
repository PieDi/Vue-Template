import { type RouteRecordRaw } from 'vue-router'

export interface PNRouter {
  path: string
  name: string
}
//获取文件名
export const getFileName = (path: string): PNRouter => {
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
//生成 Menu
export const gMenu = (list: any[], tList: any[]) => {
  list.forEach(el => {
    if (el?.meta?.menu) {
      if (el.children.length) { 
        const tl: any[] = []
        gMenu(el.children, tl)
        el.children = tl
      }
      tList.push(el)
    }
  })
  tList.sort((a, b) => a.meta.sort - b.meta.sort)
}
//查找默认的第一个路由信息
export const findFirstPage = (list: any[]): RouteRecordRaw => {
  const tPage = list[0]
  if (tPage.children.length) { 
    return findFirstPage(tPage.children)
  } else {
    return tPage
  }
}