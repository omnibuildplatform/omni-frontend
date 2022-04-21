<script setup lang="ts">
import { StringObj } from '@/shared/interface/interface';

defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  width: {
    type: String,
    default: '400px',
  },
  height: {
    type: String,
    default: '150px',
  },
  columns: {
    type: String || Number,
    default: '1',
    validator: (value) => {
      return Number(value) > 0 && Number(value) <= 5;
    },
  },
});
const columnsClass: StringObj = {
  '1': 'one-columns',
  '2': 'two-columns',
  '3': 'three-columns',
  '4': 'four-columns',
  '5': 'five-columns',
};
</script>
<template>
  <div class="common-text-content-block">
    <el-scrollbar :height="height">
      <div class="common-level-two-color default-box" :style="{ width }" :class="columnsClass[columns]">
        <div v-for="defaultItem in options" :key="(defaultItem as string)">
          {{ defaultItem }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<style lang="scss">
.default-box {
  display: grid;
}
.one-columns {
  grid-template-columns: 100%;
}
.two-columns {
  grid-template-columns: 50% 50%;
}
.three-columns {
  grid-template-columns: 33% 33% 33%;
}
.four-columns {
  grid-template-columns: 25% 25% 25% 25%;
}
.five-columns {
  grid-template-columns: 20% 20% 20% 20% 20%;
}
</style>
