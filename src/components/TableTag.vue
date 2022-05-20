<script setup lang="ts">
import { AnyObj } from '@/shared/interface/interface';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({} as AnyObj),
  },
  tableCol: {
    type: Object,
    default: () => ({} as AnyObj),
  },
});
const tags = ref([] as AnyObj[]);
const getTags = () => {
  tags.value = Object.keys(props.modelValue).reduce((pre, next) => {
    if (Array.isArray(props.modelValue[next]) && props.modelValue[next]?.length) {
      const obj = {
        key: props.tableCol[next]?.key || next,
        label: props.tableCol[next]?.label || next,
        value: props.modelValue[next].join(','),
      };
      pre.push(obj);
    }
    return pre;
  }, [] as AnyObj[]);
};
onMounted(() => {
  getTags();
});
watch(
  () => props.modelValue,
  () => getTags(),
  { deep: true }
);
const emit = defineEmits(['update:modelValue']);
const handleClose = (tag: AnyObj) => {
  emit('update:modelValue', [tag]);
};
</script>

<template>
  <div>
    <el-tag v-for="tag in tags" :key="tag.label" class="tag" size="large" closable @close="handleClose(tag)"> {{ tag.label }}: {{ tag.value }} </el-tag>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  margin-bottom: 8px;
  margin-right: 8px;
}
</style>
