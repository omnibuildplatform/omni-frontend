<script setup lang="ts">
import ProductSelect from './product-select/ProductSelect.vue';
</script>
<template>
  <div class="iso">
    <div class="iso-header">Image from ISO</div>
    <div class="common-level-one-color common-level-one-fz m-b-24">
      <span>Choose Images:</span>
      <ProductSelect type="group" width="360px"></ProductSelect>
    </div>
    <div class="common-level-one-color common-level-one-fz m-b-24">
      <span>Choose KickStart Files:</span>
      <ProductSelect type="group" width="360px"></ProductSelect>
    </div>
    <div>
      <p>Selected KS file</p>
      <EditorComponent />
    </div>
  </div>
</template>
<style lang="scss" scoped></style>
