<script setup lang="ts">
import type { IDomEditor } from '@wangeditor/editor';

import {
  computed,
  getCurrentInstance,
  onBeforeUnmount,
  reactive,
  shallowRef,
  watch,
} from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import '@wangeditor/editor/dist/css/style.css';

defineOptions({
  name: 'WngEditor',
});
// 定义父组件传过来的值
const props = defineProps({
  // 是否禁用
  disable: {
    type: Boolean,
    default: () => false,
  },
  // 内容框默认 placeholder
  placeholder: {
    type: String,
    default: () => '请输入内容...',
  },
  // https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F
  // 模式，可选 <default|simple>，默认 default
  mode: {
    type: String,
    default: () => 'default',
  },
  // 双向绑定，用于获取 editor.getHtml()
  getHtml: {
    type: String,
    default: () => '',
  },
  // 双向绑定，用于获取 editor.getText()
  getText: {
    type: String,
    default: () => '',
  },
  uploadFileUrl: {
    type: String,
    default: `/admin/sys-file/upload`,
  },
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['update:value', 'update:getText']);

const { proxy } = getCurrentInstance();

// 定义上传需要的请求头信息
const headers = computed(() => {
  return {
    Authorization: `Bearer token`,
    'TENANT-ID': 'TenantId',
  };
});

// 定义上传需要的字段信息
const uploadAttr = reactive({
  fieldName: 'file',
  server: proxy.baseURL + props.uploadFileUrl,
  headers,
  customInsert(res, insertFn) {
    insertFn(proxy.baseURL + res.data.url);
  },
});

const editorRef = shallowRef();
const state = reactive({
  editorConfig: {
    placeholder: props.placeholder,
    MENU_CONF: {
      uploadImage: uploadAttr,
      uploadVideo: uploadAttr,
    },
  },
  editorVal: props.value,
});

// 编辑器回调函数
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;
};

// 编辑器内容改变时
const handleChange = (editor: IDomEditor) => {
  emit('update:value', editor.getHtml());
  emit('update:getText', editor.getText());
};

// 页面销毁时
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null) return;
  editor.destroy();
});

// 监听是否禁用改变
watch(
  () => props.disable,
  (bool) => {
    const editor = editorRef.value;
    if (editor === null) return;
    bool ? editor.disable() : editor.enable();
  },
  {
    deep: true,
  },
);
// 监听双向绑定值改变，用于回显
watch(
  () => props.value,
  (val) => {
    state.editorVal = val;
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div
    style="
      z-index: 1000;
      width: 1000px;
      height: auto;
      margin-top: 10px;
      border: 1px solid #ccc;
    "
  >
    <Toolbar
      :editor="editorRef"
      :mode="mode"
      style="width: auto; height: auto; border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="state.editorVal"
      :default-config="state.editorConfig"
      :mode="mode"
      style="height: 400px; overflow-y: hidden"
      @on-change="handleChange"
      @on-created="handleCreated"
    />
  </div>
</template>
