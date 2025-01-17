<script setup lang="ts">
import { PropType, toRaw, computed } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import AsideItem from './aside-item.vue'
import { nameToLowPath } from '@/utils/layout'

const props = defineProps({
  mItem: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
})
const { mItem } = toRaw(props)
const menuGroup = computed(() => {
  const res: RouteRecordRaw[] = []
  mItem.children?.forEach(item => {
    if (item.children?.length) res.push(item)
  })
  return res
})
</script>
<template>
  <template v-if="mItem.component">
    <el-menu-item :index="mItem.path">
      <el-icon>
        <component :is="mItem?.meta?.icon || 'Setting'" />
      </el-icon>
      {{ mItem?.meta?.title }}
    </el-menu-item>
  </template>

  <template v-if="menuGroup.length">
    <el-sub-menu :index="menuGroup[0].path">
      <template #title>{{ menuGroup[0]?.meta?.title }}</template>
      <AsideItem v-for="m in menuGroup" :m-item="m" />
    </el-sub-menu>
  </template>
</template>
<style lang="less" scoped></style>
