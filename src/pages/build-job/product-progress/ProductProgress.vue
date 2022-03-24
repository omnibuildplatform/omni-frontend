<script setup lang="ts">
import { StringObj } from '@/shared/interface/interface';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: Number || String,
    default: 0,
  },
  status: {
    type: String,
    default: 'loading',
  },
});

// 定义进度条颜色
const statusConfig: StringObj = {
  loading: 'loading-bar',
  exception: 'exception-bar',
  success: 'success-bar',
};

const _value = computed(() => `${props.value}%`);
</script>
<template>
  <div class="total-bar">
    <el-tooltip effect="light" :content="_value" placement="right-end">
      <div class="select-bar" :class="statusConfig[status] || 'loading-bar'" :style="{ width: _value }"></div>
    </el-tooltip>
  </div>
</template>
<style lang="scss" scoped>
.total-bar {
  width: 100%;
  height: 8px;
  background-color: #444444;
  border: 1px solid #444444;
  border-radius: 4px;
  position: relative;
  .select-bar {
    box-sizing: content-box;
    position: absolute;
    top: -1px;
    height: 8px;
    border-radius: 4px;
    transition: width 1s;
  }
  .loading-bar {
    background: #222222 linear-gradient(90deg, #622ec3 0%, #4d65db 32%, #379aee 64%, #53e9f6 100%, #13ccd7 100%);
  }

  .exception-bar {
    background: rgb(245, 108, 108);
  }
  .success-bar {
    background: rgb(103, 194, 58);
  }
}
</style>
