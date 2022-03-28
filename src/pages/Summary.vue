<script setup lang="ts">
/*
 * This starter template is using Vue 3 <script setup> SFCs
 * Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
 */
import AppHeader from '../components/AppHeader.vue';
import BuildJob from './build-job/BuildJob.vue';
</script>

<template>
  <AppHeader />
  <div class="app-body common-body-bg-color">
    <BuildJob />
  </div>
</template>

<style lang="scss">
.app-body {
  padding: 4rem 23rem;
}
</style>
