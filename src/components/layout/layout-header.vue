<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import useConfigStore from '@/store/config'
import { ElMenu, ElMenuItem, ElIcon } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { type RouteRecordRaw } from 'vue-router'


const configStore = useConfigStore()
const activeMenu = ref('')
const route = useRoute()
const router = useRouter()
onMounted(() => { })
watch(
  () => route.fullPath,
  () => {
    const paths = route.fullPath.split('/')
    const p = `/${paths[1]}`
    if (p !== activeMenu.value) {
      activeMenu.value = p
      const tMenu = configStore.menus.find((m: RouteRecordRaw)  => m.path === p)
      if (tMenu) {
        configStore.updateActiveMenus(tMenu?.name)
        if (!tMenu?.component) {
          setTimeout(() => {
            //@ts-ignore
            router.push({ path: tMenu.children[0].path })
          }, 500)
        }
      }
    }
  },
  {
    immediate: true,
  }
)
const handleSelect = (index: string) => {
  const tMenu = configStore.menus.find((m: RouteRecordRaw) => m.path === index)
  configStore.updateActiveMenus(tMenu?.name)
}
</script>
<template>
  <header class="header">
    <!-- :collapse="isCollapse" -->
    <el-menu class="menu" :default-active="activeMenu" mode="horizontal" router @select="handleSelect">
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
