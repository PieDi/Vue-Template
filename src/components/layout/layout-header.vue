<script setup lang="ts">
import useConfigStore from '@/store/config'
import { ElMenu, ElMenuItem, ElIcon } from 'element-plus'
const configStore = useConfigStore()
console.log('header 获取', configStore.menu)
const handleClose = () => {}
const isCollapse = () => {}
const handleOpen = () => {}
</script>
<template>
  <header class="header">
    <el-menu
    class="menu"
      default-active="2"
      mode="horizontal"
      :collapse="isCollapse"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="2">
        <el-icon><icon-menu /></el-icon>
        <template #title>Navigator Two</template>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><document /></el-icon>
        <template #title>Navigator Three</template>
      </el-menu-item>
      <el-menu-item index="4">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item>
    </el-menu>
    <div :style="{height: '100%', width: '60px'}"></div>
  </header>
</template>
<style lang="less" scoped>
.header {
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  .menu{
    flex: 1;
    margin-right: 20px;
  }
}
</style>
