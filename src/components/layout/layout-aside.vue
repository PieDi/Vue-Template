<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import useConfigStore from '@/store/config'
import { ElMenu } from 'element-plus'
import AsideGItem from './aside-gItem.vue'
import { type RouteRecordRaw } from 'vue-router'
import { useRoute } from 'vue-router'

const configStore = useConfigStore()
const activeMenu = ref('')
const route = useRoute()
watch(
  () => route.fullPath,
  () => {
    activeMenu.value = route.fullPath
  },
  {
    immediate: true,
  }
)

const handleSelect = (_index: string) => {
  // configStore.updateActiveMenus(_index)
  console.log('handleSelect', _index)
}
const menuGroup = computed(() => {
  const res: RouteRecordRaw[] = []
  configStore.activeMenuGroup?.children?.forEach(item => {
    if (item.component || item.children?.length) res.push(item)
  })
  return res
})
</script>
<template>
  <aside class="aside">
    <div class="logo"></div>
    <div class="content">
      <el-menu
        class="menu"
        :default-active="activeMenu"
        router
        @select="handleSelect"
      >
        <template v-if="configStore.activeMenuGroup?.component">
          <el-menu-item :index="configStore.activeMenuGroup.path">
            <el-icon>
              <component
                :is="configStore.activeMenuGroup?.meta?.icon || 'Setting'"
              />
            </el-icon>
            {{ configStore.activeMenuGroup?.meta?.title }}
          </el-menu-item>
        </template>
        <AsideGItem
          v-for="(m, i) in menuGroup"
          :m-item="m"
          :key="m.path || i"
        />
      </el-menu>
    </div>
  </aside>
</template>
<style lang="less" scoped>
.aside {
  width: 200px;
  background: #fff;
  .logo {
    height: 60px;
    color: aqua;
  }
  .content {
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}
</style>
