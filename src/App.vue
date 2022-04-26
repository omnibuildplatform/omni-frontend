<script setup lang="ts">
import { setStoreData } from './shared/utils/login';

/*
 * This starter template is using Vue 3 <script setup> SFCs
 * Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
 */
setStoreData();
</script>

<template>
  <AppHeader />
  <div class="common-body-bg-color app-body">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app-body {
  width: 100%;
  ::-webkit-scrollbar {
    display: inline;
  }
}
</style>
