<script setup lang="ts">
import ProductSelect from './product-select/ProductSelect.vue';
</script>
<template>
  <div class="iso">
    <div class="iso-header m-b-24">Image from ISO</div>
    <div class="iso-body common-content-bg-color common-level-two-fz">
      <div class="iso-body-select m-b-40">
        <span class="iso-body-select-title">Choose Images</span>
        <ProductSelect class="margin-right" type="group" width="300px"></ProductSelect>
        <span class="iso-body-select-title">Choose KickStart Files</span>
        <ProductSelect type="group" width="300px"></ProductSelect>
      </div>
      <div>
        <p class="m-b-24">Selected KS file</p>
        <EditorComponent />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.iso {
  padding: 40px;
  &-header {
    height: 32px;
    font-size: 24px;
    line-height: 32px;
    font-weight: bold;
  }
  &-body {
    padding: 40px;
    &-select {
      display: flex;
      align-items: center;
      &-title {
        margin-right: 16px;
      }
    }
  }
}
.margin-right {
  margin-right: 24px;
}
</style>
