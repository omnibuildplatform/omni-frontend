<script setup lang="ts">
import { useStoreData } from '@/shared/utils/login';
import { showGuard, logout } from '@/shared/utils/login';
import { ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
const { guardAuthClient } = useStoreData();
let dialogVisible = ref(false);
</script>
<template>
  <div class="common-content-bg-color app-header">
    <div class="app-header-logo">
      <SvgIcon class="logo" name="logo"></SvgIcon>
    </div>
    <div class="right-opt">
      <el-dropdown v-if="guardAuthClient.photo">
        <div class="el-dropdown-link">
          <img :src="guardAuthClient.photo" :alt="guardAuthClient.nickname || 'LogOut'" class="img" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dialogVisible = true">Log Out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown v-else>
        <div class="el-dropdown-link">
          <img src="../assets/default-user-avatar.png" alt="Login" class="img" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="showGuard()">Log In</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog v-model="dialogVisible" title="Confirm" width="30%">
      <span>Are you sure you want to exit? The page is refreshed after you exit.</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button
            type="primary"
            @click="
              dialogVisible = false;
              logout();
            "
            >Confirm</el-button
          >
        </span>
      </template>
    </el-dialog>
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
  cursor: pointer;
}
.right-opt {
  margin-right: 72px;
}
</style>
