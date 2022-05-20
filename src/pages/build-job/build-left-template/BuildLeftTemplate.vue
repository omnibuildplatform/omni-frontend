<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});
const _name = ref(props.name);
const _description = ref(props.description);
watch(
  () => props.name,
  () => {
    if (_name.value !== props.name) {
      _name.value = props.name;
    }
  }
);
watch(
  () => props.description,
  () => {
    if (_description.value !== props.description) {
      _description.value = props.description;
    }
  }
);
const emit = defineEmits(['update:name', 'update:description', 'build']);
const changEvent = (type: string, e: string) => {
  emit(type === 'name' ? 'update:name' : 'update:description', e);
};
const build = () => {
  emit('build');
};
</script>
<template>
  <div class="build-left">
    <div class="build-left-title">Name</div>
    <el-input v-model="_name" maxlength="64" placeholder="Please input" @input="changEvent('name', $event)" />
    <div class="m-t-40 build-left-title">Description</div>
    <el-input
      v-model="_description"
      :rows="6"
      type="textarea"
      maxlength="512"
      resize="none"
      placeholder="Please input"
      show-word-limit
      @input="changEvent('description', $event)"
    />
    <div class="build-left-btngroup">
      <el-button class="btn" type="primary" @click="build">Build</el-button>
      <el-button class="btn" disabled type="primary">Stop</el-button>
      <el-button class="btn" disabled type="primary">Download</el-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import '@/shared/styles/handle.scss';
.build-left {
  padding: 40px 24px;
  @include background_color('bg-color2');
  &-title {
    font-size: 20px;
    margin-bottom: 16px;
    line-height: 28px;
  }
  &-btngroup {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;
    .btn {
      width: 100px;
    }
  }
}
</style>
