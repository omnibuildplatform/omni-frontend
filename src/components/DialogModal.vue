<script setup lang="ts">
import { ref } from 'vue';
const visable = ref(false);
const headerTitle = ref('');
const content = ref('');
const callback = ref(() => null);
interface Param {
  headerTitle: string;
  content: string;
  callback: () => any | null;
}
const open = (params: Param) => {
  visable.value = true;
  headerTitle.value = params.headerTitle || 'Tips';
  content.value = params.content || 'Content';
  callback.value = params.callback;
};
defineExpose({ open });
</script>
<template>
  <el-dialog v-model="visable" :title="headerTitle" width="30%" draggable center>
    <span>{{ content }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="
            visable = false;
            callback();
          "
          >Confirm
        </el-button>
        <el-button @click="visable = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style lang="scss"></style>
