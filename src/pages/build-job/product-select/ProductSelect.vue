<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'icon',
  },
  options: {
    type: Array,
    default: () => [],
  },
  value: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['changeData']);
const change = (e: string) => {
  emit('changeData', e);
};
</script>
<template>
  <p>{{ title }}:</p>
  <el-select :model-value="value" placeholder="请选择" @change="change">
    <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
  </el-select>
</template>
<style lang="scss" scoped>
p {
  margin-bottom: 8px;
}
</style>
