<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navList = [
  {
    id: "build-job",
    label: "build-job",
    href: "/build-job",
  },
];

const navClick = (item: NavItem) => {
  router.push(item.href);
};
</script>
<template>
  <div class="app-header">
    <img class="logo" alt="openEuler logo" src="../assets/logo.png" />
    <div>admin</div>
  </div>
</template>
<style lang="scss">
.app-header {
  display: flex;
  height: 60px;
  padding: 8px 24px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba($color: #000000, $alpha: 0.1);
}
.logo {
  height: 80%;
}
</style>
