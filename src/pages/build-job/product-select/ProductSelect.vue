<script setup lang="ts">
import { StringObj } from '@/shared/interface/interface';

defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (value: string) => {
      return ['default', 'group'].includes(value);
    },
  },
  title: {
    type: String,
    default: 'icon',
  },
  options: {
    type: Array as () => any[],
    default: () => [] as any[],
  },
  value: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
});
const emit = defineEmits(['changeData']);
const change = (e: string) => {
  emit('changeData', e);
};

// 控制输入框样式
const selectClass: StringObj = {
  default: 'product-select-item',
  group: 'product-select-group-item',
};
</script>
<template>
  <div :class="selectClass[type]" :style="{ width }">
    <el-select popper-class="block-popper" :popper-append-to-body="false" :model-value="value" placeholder="Please select" @change="change">
      <el-option v-for="item in options" :key="item?.key || item" :label="item?.label || item" :value="item?.value || item"> </el-option>
    </el-select>
  </div>
</template>
<style lang="scss" scoped>
@import '../../../shared/styles/handle.scss';
// 穿透样式
.product-select-item {
  .el-select {
    width: 100%;
  }
  :deep(.el-input__inner) {
    width: 100%;
    height: 48px;
    @include background_color('bg-color3');
    border: 1px solid #ffffff;
    font-size: 16px;
    color: #ffffff;
  }
}
.product-select-group-item {
  .el-select {
    width: 100%;
  }
  :deep(.el-input__inner) {
    height: 40px;
  }
}
</style>
