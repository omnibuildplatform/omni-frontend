<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  dataKey: {
    type: String,
    default: () => 'key',
  },
  itemSize: {
    type: Number,
    default: () => 30,
  },
  poolBuffer: {
    type: Number,
    default: () => 10,
  },
});
const root = ref<HTMLElement | null>(null);
const pool = ref<any[]>([]);
const scrollHeight = computed(() => {
  return props.data.length * props.itemSize;
});
watch(
  () => props.data,
  () => {
    if (root.value) {
      const _scrollTop = props.data.length * props.itemSize - root.value.clientHeight;
      if (root.value.scrollTop > _scrollTop) {
        // 切换数据后，滚动高度大于数据高度则滚动到底部
        root.value.scrollTop = _scrollTop;
      }
    }
    getValue();
  }
);

const paddingTop = ref(0);
let isScrollBusy = false;

const handleScroll = () => {
  if (!root.value) return;
  if (isScrollBusy) return;
  isScrollBusy = true;

  requestAnimationFrame(() => {
    isScrollBusy = false;
    getValue();
  });
};

onMounted(() => {
  getValue();
});
const getValue = () => {
  if (!root.value) return;
  const range: number[] = [];
  range[0] = Math.floor(root.value.scrollTop / props.itemSize) - Math.floor(props.poolBuffer / 2);
  range[0] = Math.max(range[0], 0);
  range[1] = range[0] + Math.floor(root.value.clientHeight / props.itemSize) + props.poolBuffer;
  range[1] = Math.min(range[1], props.data.length);
  pool.value = props.data.slice(range[0], range[1]);
  paddingTop.value = range[0] * props.itemSize;
};
</script>
<template>
  <div ref="root" class="list-container" @scroll.passive="handleScroll">
    <div class="list-scroll" :style="`height: ${scrollHeight}px;padding-top: ${paddingTop}px`">
      <div v-for="item in pool" :key="item[dataKey]" class="list-item-container" :style="`height: ${itemSize}px`">
        <slot :item="item"></slot>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.list-container {
  width: 100%;
  height: 100%;
  min-width: 100px;
  min-height: 100px;
  overflow: auto;
}
.list-scroll {
  box-sizing: border-box;
}
.list-item-container {
  overflow: hidden;
}
</style>
