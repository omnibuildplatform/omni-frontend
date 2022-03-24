<script setup lang="ts">
/*
 * This starter template is using Vue 3 <script setup> SFCs
 * Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
 */
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <AppHeader />
  <div class="app-body common-body-bg-color">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.app-body {
  padding: 4rem 23rem;
}
</style>
