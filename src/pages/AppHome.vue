<script setup lang="ts"></script>
<template>
  <div class="home">
    <div class="home-header">
      <div class="home-header-title">OmniBuildPlatform</div>
      <div class="home-header-describe">xxx of build operating system</div>
    </div>
    <div class="home-main">
      <div class="home-main-content home-main-content-left"></div>
      <div class="home-main-content"></div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100%;
  min-height: calc(100vh - 80px);
  color: #fff;
  background-color: #002FA7;
  background-image: url('@/assets/svg-icons/home-background.svg');
  background-size: cover;
  background-position: right 25%;
  &-header {
    width: 1300px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 88px;
    &-title {
      font-size: 96px;
      line-height: 112px;
      font-weight: bold;
      margin-bottom: 24px;
    }
    &-describe {
      font-size: 56px;
      font-weight: bold;
      line-height: 75px;
    }
  }

  &-main {
    margin-top: 111px;
    padding-bottom: 24px;
    display: flex;
    justify-content: center;
    &-content {
      width: 797px;
      height: 380px;
      background: #FFFFFF;
      box-shadow: 0px 12px 32px 0px rgba(190, 196, 204, 0.2);
    }
    &-content-left {
      margin-right: 30px;
    }
  }
}
</style>
