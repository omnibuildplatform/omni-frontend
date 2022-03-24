<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const disableClass = computed(() => (props.disabled ? 'disabled' : 'enabled'));
</script>
<template>
  <div class="btn" :class="disableClass">
    <a>{{ data }}</a>
  </div>
</template>
<style lang="scss" scoped>
.btn {
  display: inline-block;
  width: 120px;
  height: 40px;
  border-radius: 20px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}
.enabled {
  background: linear-gradient(360deg, #622ec3 0%, #4d65db 32%, #379aee 64%, #53e9f6 100%, #13ccd7 100%);
  box-shadow: 0px 10px 20px 0px rgba(59, 45, 143, 0.3);
  color: #fff;
  cursor: pointer;
}
.disabled {
  background: #515151;
  border: 1px solid #666666;
  color: #666666;
  cursor: not-allowed;
}
</style>
