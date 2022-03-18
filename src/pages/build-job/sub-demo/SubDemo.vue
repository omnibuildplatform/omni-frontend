<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCounter } from '@/stores/counter';

const counter = useCounter();
const { count } = storeToRefs(counter);
</script>
<template>
  <div class="page-sub-demo">
    <h1>Demo 子页面</h1>
    <div>count value: {{ count }} <button @click="counter.increment">increment</button></div>
  </div>
</template>
<style lang="scss">
.page-sub-demo {
  padding: 60px;
  h1 {
    font-size: 24px;
  }

  button {
    cursor: pointer;
    margin-left: 24px;
    padding: 4px 8px;
    background-color: transparent;
    outline: none;
    border: 1px solid #999;
  }
}
</style>
