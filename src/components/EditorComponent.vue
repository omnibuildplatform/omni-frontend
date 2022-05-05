<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { IToolbarConfig, DomEditor } from '@wangeditor/editor';

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref('<p>hello</p>');

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<pre><code class="language-bash">## heiheiehh \nsdfewrdsfsd \nconst de asdasd\nclass a ===as</code></pre>';
  }, 1500);
});

const toolbarConfig: Partial<IToolbarConfig> = {
  /* 工具栏配置 */
  excludeKeys: ['emotion', 'insertLink', 'group-image', 'group-video', 'insertTable'],
};
const editorConfig = { placeholder: '请输入内容...' };

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
  const html = editor.getHtml();
  const text = editor.getText();
  console.log('text', JSON.stringify(text));
  console.log('html', JSON.stringify(html));
  const toolbar = DomEditor.getToolbar(editor);
  console.log(toolbar);
};
</script>
<template>
  <div class="edit">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :default-config="toolbarConfig" />
    <Editor v-model="valueHtml" style="height: 500px; overflow-y: hidden" :default-config="editorConfig" @on-created="handleCreated" />
  </div>
  <el-button type="primary" @click="save()">Save</el-button>
</template>
<style scoped lang="scss">
.edit {
  border: 1px solid #ccc;
}
</style>
