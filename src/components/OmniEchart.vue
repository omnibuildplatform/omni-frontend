<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, watch } from 'vue';
type EChartsOption = echarts.EChartsOption;
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: '',
  },
  option: {
    type: Object as () => EChartsOption,
    required: true,
    default: {} as EChartsOption,
  },
  width: {
    type: String,
    default: '200px',
  },
  height: {
    type: String,
    default: '200px',
  },
});
watch(
  () => props.option,
  () => initEchart(),
  { deep: true }
);
onMounted(() => {
  initEchart();
});
const initEchart = () => {
  const chartDom = document.getElementById(props.id);
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    myChart.setOption(props.option);
  }
};
</script>
<template>
  <div :id="id" :style="{ width, height }"></div>
</template>
<style scoped lang="scss"></style>
