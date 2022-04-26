<script setup lang="ts">
import { useStoreData } from '@/shared/utils/login';

const { selectAsideItem } = useStoreData();
</script>
<template>
  <el-menu :default-active="selectAsideItem" :router="true" class="app-aside">
    <el-menu-item index="/control/general-view">
      <span>General view</span>
    </el-menu-item>
    <el-menu-item index="/control/build-image">
      <span>Build Image</span>
    </el-menu-item>
    <el-menu-item index="/control/job-list">
      <span>Job List</span>
    </el-menu-item>
  </el-menu>
</template>
<style scoped lang="scss">
@import '../shared/styles/handle';
.app-aside {
  @include background_color('bg-color3');
  font-size: 18px;
  .el-menu-item {
    color: #fff;
    &:hover {
      @include background_color('bg-color1');
      @include font_color('bg-color3');
    }
  }
  .is-active {
    @include background_color('bg-color2');
    @include font_color('bg-color3');
  } 
}
</style>
