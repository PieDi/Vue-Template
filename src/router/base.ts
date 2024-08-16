import { type RouteRecordRaw } from 'vue-router'

export const baseRouterConfig: RouteRecordRaw[] = [
  {
    path: '/404',
    name: '404',
    component: import('@/404.vue')
  }
]
