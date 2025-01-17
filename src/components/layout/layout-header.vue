<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useConfigStore from '@/store/config'
import { ElMenu, ElMenuItem, ElIcon } from 'element-plus'
import { useRoute } from 'vue-router'
const configStore = useConfigStore()
const activeMenu = ref('')
const route = useRoute()
onMounted(() => {})
watch(
  () => configStore.menus,
  () => {
    if (configStore.menus.length) {
      activeMenu.value = configStore.menus[0].path
    }
  }
)
watch(
  () => route.fullPath,
  () => {
    activeMenu.value = route.fullPath
  },
  {
    immediate: true,
  }
)

const isCollapse = () => {
  return false
}
const handleSelect = (_index: string) => {
  configStore.updateActiveMenus(_index)
}
</script>
<template>
  <header class="header">
    <el-menu
      class="menu"
      :default-active="activeMenu"
      mode="horizontal"
      router
      :collapse="isCollapse"
      @select="handleSelect"
    >
      <el-menu-item v-for="m in configStore.menus" :index="m.path">
        <el-icon>
          <component :is="m?.meta?.icon || 'Setting'" />
        </el-icon>
        {{ m?.meta?.title || '菜单选项' }}
      </el-menu-item>
    </el-menu>
  </header>
</template>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 60px;
  background: #fff;

  .menu {
    flex: 1;
    margin-right: 20px;
  }
}
</style>
