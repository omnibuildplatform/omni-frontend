<script setup lang="ts"></script>
<template>
  <div class="flex">
    <AppAside />
    <div class="app-view-block">
      <div style="overflow-y: auto">
        <router-view />
      </div>
    </div>
  </div>
</template>
