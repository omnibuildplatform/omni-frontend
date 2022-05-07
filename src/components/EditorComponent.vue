<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig } from '@wangeditor/editor';
import { i18nChangeLanguage } from '@wangeditor/editor';

i18nChangeLanguage('en');
const props = defineProps({
  data: {
    type: String,
    default: '',
  },
  id: {
    type: String,
    default: '',
  },
});
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('');
const getValueHtml = () => {
  valueHtml.value = `<pre><code class="language-bash">${props.data}</code></pre>`;
};
watch(
  () => props.data,
  () => {
    getValueHtml();
  }
);

const toolbarConfig: Partial<IToolbarConfig> = {
  /* 工具栏配置 */
  excludeKeys: ['group-more-style', 'blockquote', 'todo', 'divider', 'emotion', 'insertLink', 'group-image', 'group-video', 'insertTable'],
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  // 记录 editor 实例，重要！
  editorRef.value = editor;
};

const save = () => {
  const editor = editorRef.value;
  let data = editor.getText();
  if (data?.slice(0, 1) === '\n') {
    data = data.slice(1);
  }
  if (data?.slice(-1) === '\n') {
    data = data.slice(0, -1);
  }
  return {
    id: props.id,
    data,
  };
};
defineExpose({ save });
</script>
<template>
  <div class="edit">
    <Toolbar class="bar" :editor="editorRef" :default-config="toolbarConfig" />
    <Editor v-model="valueHtml" style="height: 500px; overflow-y: hidden" @on-created="handleCreated" />
  </div>
</template>
<style scoped lang="scss">
.edit {
  border: 1px solid #ccc;
}
.bar {
  border-bottom: 1px solid #ccc;
  :deep(.w-e-bar) {
    background-color: #e5e8f0;
  }
}
</style>
