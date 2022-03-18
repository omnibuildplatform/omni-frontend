<script setup lang="ts">
defineProps({
  options: {
    type: Object,
  },
  width: {
    type: String,
    default: "400px",
  },
  height: {
    type: String,
    default: "150px",
  },
});
</script>
<template>
  <div class="default-box" :style="{ width, height }">
    <div v-for="defaultItem in options" :key="defaultItem">
      {{ defaultItem }}
    </div>
  </div>
</template>
<style lang="scss">
.default-box {
  border: 1px solid black;
  overflow-y: auto;
  margin-top: 8px;
}
</style>
