<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';

import CodeMirror from 'codemirror';

// 框架
import 'codemirror/addon/selection/active-line';
// 语言
import 'codemirror/mode/velocity/velocity';
import 'codemirror/mode/go/go';
import 'codemirror/mode/vue/vue';

import 'codemirror/lib/codemirror.css';
// 主题
import 'codemirror/theme/idea.css';
import 'codemirror/theme/darcula.css';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'velocity',
  },
  height: {
    type: [String, Number],
    default: 300,
  },
  options: {
    type: Object,
    default: () => {},
  },
  theme: {
    type: String,
    default: 'idea',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['update:modelValue']);

const contentValue = ref(props.modelValue);
const coder = ref(null);
const opt = reactive({
  theme: props.theme, // 主题
  styleActiveLine: true, // 高亮当前行
  lineNumbers: true, // 行号
  lineWrapping: false, // 自动换行
  tabSize: 4, // Tab缩进
  indentUnit: 4, // 缩进单位
  indentWithTabs: true, // 自动缩进
  mode: props.mode, // 语言
  readOnly: props.readOnly, // 只读
  ...props.options,
});

const heightValue = computed(() => {
  return Number(props.height) ? `${Number(props.height)}px` : props.height;
});

watch(
  () => props.modelValue,
  (val) => {
    contentValue.value = val;
    if (val !== coder.value.getValue()) {
      coder.value.setValue(val);
    }
  },
);

const init = () => {
  coder.value = CodeMirror.fromTextArea(
    document.querySelector('#textarea'),
    opt,
  );
  coder.value.on('change', (cm) => {
    contentValue.value = cm.getValue();
    emit('update:modelValue', contentValue.value);
  });
};

onMounted(init);
</script>

<template>
  <div class="code-editor" :style="{ height: heightValue }">
    <textarea id="textarea" v-model="contentValue"></textarea>
  </div>
</template>

<style scoped>
.code-editor {
  font-size: 14px;
  line-height: 150%;
  border: 1px solid #ddd;
}

.code-editor:deep(.CodeMirror) {
  height: 100%;
}
</style>
