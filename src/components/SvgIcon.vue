<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    validator(value: string) {
      return ['large', 'small', 'normal', ''].includes(value);
    },
    default: '',
  },
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
<template>
  <svg aria-hidden="true" class="svg-icon" :class="[size, name]">
    <use :xlink:href="symbolId" />
  </svg>
</template>
<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: top;
  stroke: currentColor;
  fill: currentColor;
  stroke-width: 0;
  outline: 0;

  &.large {
    font-size: 32px;
  }

  &.small {
    font-size: 16px;
  }

  &.normal {
    font-size: 24px;
  }
}
</style>
