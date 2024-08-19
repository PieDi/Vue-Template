<script setup lang="ts">
import { ref, watch } from 'vue'
import useConfigStore from '@/store/config'
import { ElMenu, ElMenuItem, ElIcon } from 'element-plus'
const configStore = useConfigStore()
console.log('aside 获取', configStore.activeMens)
const activeMenu = ref('')
watch(
  () => configStore.activeMens,
  () => {
    if (configStore.activeMens.length) {
      activeMenu.value = configStore.activeMens[0].name as string
    }
  },
  { immediate: true }
)

const handleSelect = (_index: string) => {
  configStore.updateActiveMenus(_index)
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
    <el-sub-menu index="1">
          <template #title>
            <el-icon><location /></el-icon>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-4">
            <template #title>item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      <!-- @vue-ignore -->
      <el-menu-item v-for="m in configStore.activeMens" :index="m.name">
        <el-icon>
          <component :is="m?.meta?.icon || 'Setting'" />
        </el-icon>
        {{ m?.meta?.title || '菜单选项' }}
      </el-menu-item>
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
