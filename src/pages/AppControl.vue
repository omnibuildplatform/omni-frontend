<script setup lang="ts"></script>
<template>
  <div class="control">
    <AppAside />
    <div class="app-view-block">
      <div style="overflow-y: auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.control {
  display: grid;
  grid-template-columns: 200px auto;
}
</style>
