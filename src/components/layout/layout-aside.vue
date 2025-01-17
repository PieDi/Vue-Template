<script setup lang="ts">
import { ref, watch } from 'vue'
import useConfigStore from '@/store/config'
import { findFirstPage } from '@/utils/router'
import { nameToLowPath } from '@/utils/layout'
import { ElMenu } from 'element-plus'
import AsideItem from './aside-item.vue'
const configStore = useConfigStore()
console.log('aside 获取', configStore.activeMenu)
const activeMenu = ref('')
watch(
  () => configStore.activeMenu,
  (newVal) => {
    if (newVal?.meta?.menu) {
      activeMenu.value = nameToLowPath(newVal.meta.name as string)
    } else { 
      const fPage = findFirstPage([newVal])
      activeMenu.value = nameToLowPath(fPage.name as string)
    }
  },
  { immediate: true }
)
const handleSelect = (_index: string) => {
  // configStore.updateActiveMenus(_index)
}
</script>
<template>
  <aside class="aside">
    <div class="logo"></div>
    <div class="content">
      <el-menu
      class="menu"
      :default-active="activeMenu"
      :router="true"
      @select="handleSelect"
    >
      <AsideItem v-if="configStore.activeMenu" :m-item="configStore.activeMenu"/>
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
    overflow-y: auto
  }
}
</style>
