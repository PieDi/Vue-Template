<script setup lang="ts">
import Header from './layout-header.vue'
import Aside from './layout-aside.vue'
</script>
<template>
  <div class="layout">
    <Aside />
    <section class="section">
      <Header />
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </section>
  </div>
</template>
<style lang="less" scoped>
.layout {
  display: flex;
  height: 100%;
  background: #eee9e9;

  .section {
    display: flex;
    flex: 1;
    flex-direction: column;

    .content {
      flex: 1;
      margin: 15px;
      margin-bottom: 0;
      background: #fff;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
    .fade-enter-to,
    .fade-leave-from {
      opacity: 1;
    }
    .fade-enter-active,
    .fade-leave-active {
      transition: 0.5s ease;
    }
  }
}
</style>
