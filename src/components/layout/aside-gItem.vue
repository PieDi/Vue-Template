<script setup lang="ts">
import { PropType, toRaw, computed, watch } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
const props = defineProps({
  mItem: {
    type: Object as PropType<RouteRecordRaw>,
    required: true,
  },
})
const { mItem } = toRaw(props)
const menuGroup = computed(() => {
  const res: RouteRecordRaw[] = []
  mItem?.children?.forEach(item => {
    if (item.component || item.children?.length) res.push(item)
  })
  return res
})
</script>
<template>
  <el-sub-menu :index="mItem.path">
    <template #title>{{ mItem.meta?.title }}</template>
    <template v-if="mItem?.component">
      <el-menu-item :index="mItem.path">
        <el-icon>
          <component :is="mItem?.meta?.icon || 'Setting'" />
        </el-icon>
        {{ mItem?.meta?.title }}
      </el-menu-item>
    </template>
    <AsideGItem v-for="(m, i) in menuGroup" :m-item="m" :key="m.path || i" />
  </el-sub-menu>
</template>
<style lang="less" scoped></style>
