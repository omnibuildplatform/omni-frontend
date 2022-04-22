<script setup lang="ts"></script>
<template>
  <div class="app-footer">
    <div class="app-footer-left">
      <img class="app-footer-left-logo" src="@/assets/auto-logo.png" />
      <div>openEuler是由开放原子开源基金会(OpenAtom Foundation)孵化及运营的开源项目</div>
    </div>
    <div class="app-footer-right">
      <SvgIcon class="m-b-8" name="logo"></SvgIcon>
      <div class="m-b-16">
        <span>品牌</span>
        <span class="line">|</span>
        <span>隐私政策</span>
        <span class="line">|</span>
        <span>法律声明</span>
      </div>
      <div class="m-b-16">contact@openeuler.org</div>
      <div>版权所有 © 2022 moocstudio 保留一切权利</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.app-footer {
  padding: 54px 252px;
  background-color: #191a20;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  &-left {
    &-logo {
      width: 228px;
      height: 48px;
      margin-top: 24px;
      margin-bottom: 16px;
    }
  }
  &-right {
    text-align: center;
  }
}
.logo {
  width: 230px;
  height: 38px;
  position: relative;
  left: -13px;
}
.line {
  margin-left: 12px;
  margin-right: 12px;
}
</style>
