<script setup lang="ts">
import { useStoreData } from '@/shared/utils/common';
import SvgIcon from './SvgIcon.vue';
const { guardAuthClient } = useStoreData();
</script>
<template>
  <div class="common-content-bg-color app-header">
    <div class="app-header-logo">
      <SvgIcon class="logo" name="logo"></SvgIcon>
    </div>
    <img :src="guardAuthClient.photo" :alt="guardAuthClient.nickname || 'admin'" class="img" />
  </div>
</template>
<style scoped lang="scss">
.app-header {
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 20px 70px 0px rgba(0, 0, 0, 0.25);
}
.app-header-logo {
  height: 80px;
}
.logo {
  height: 60px;
  width: 400px;
  margin-top: 10px;
}
.img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 24px;
  cursor: pointer;
}
</style>
