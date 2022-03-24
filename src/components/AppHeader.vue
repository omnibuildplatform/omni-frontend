<script setup lang="ts">
import { useRouter } from 'vue-router';
import SvgIcon from './SvgIcon.vue';
const router = useRouter();

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navList = [
  {
    id: 'build-job',
    label: 'build-job',
    href: '/build-job',
  },
];

const navClick = (item: NavItem) => {
  router.push(item.href);
};
</script>
<template>
  <div class="common-content-bg-color app-header">
    <div class="app-header-logo">
      <SvgIcon class="logo" name="logo"></SvgIcon>
    </div>
    <div class="common-level-one-color">admin</div>
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
</style>
