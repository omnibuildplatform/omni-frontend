<script setup lang="ts">
import { StringObj } from '@/shared/interface/interface';

const props = defineProps({
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
    type: Array,
    default: () => [],
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
  <div class="product-select-item" :class="selectClass[type]" :style="{ width }">
    <el-select popper-class="block-popper" :popper-append-to-body="false" :model-value="value" placeholder="请选择" @change="change">
      <el-option v-for="item in options" :key="item" :label="item" :value="item"> </el-option>
    </el-select>
  </div>
</template>
<style lang="scss" scoped>
// 穿透样式
.product-select-item {
  .el-select {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    width: 100%;
    height: 52px;
    text-align: center;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0px 10px 30px 0px rgba(0, 0, 0, 0.1);
    border: 2px solid #ffffff;
    font-size: 15px;
    color: #ffffff;
    border-radius: 26px;
  }
}
::v-deep .block-popper {
  background: #444 !important;
}

.block-popper {
  .el-select-dropdown__item {
    color: #ffffff;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #181818;
  }
  .el-select-dropdown__item.selected {
    color: var(--el-color-primary);
  }
}
.product-select-group-item {
  .el-select {
    width: 100%;
  }
  ::v-deep .el-input__inner {
    height: 52px;
    text-align: center;
    background: rgba(0, 0, 0, 0.15);
    box-shadow: inset 0px 10px 40px 0px rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.15);
    font-size: 15px;
    color: #ffffff;
    border-radius: 8px;
  }
}
</style>
