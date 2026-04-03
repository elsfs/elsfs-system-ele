<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import WngEditor from '#/components/Editor/index.vue';

defineOptions({
  name: 'AiKnowledgeDocTestModal',
});
const type = ref<'file' | 'text'>('text');
const [BaseForm, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1',
  // 提交按钮参数
  submitButtonOptions: {
    show: false,
  },
  // 重置按钮参数
  resetButtonOptions: {
    show: false,
  },
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'vertical',
  schema: [],
});
async function onSubmit() {
  const { valid, values } = await formApi.validate();
  if (!valid) {
    return;
  }
  // todo 待修复 提交
  ElMessage.success({
    message: `form values: ${JSON.stringify(values)}`,
  });
}
const [Modal, modalApi] = useVbenModal({
  onConfirm: onSubmit,
  onOpenChange,
});
function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const data = modalApi.getData<Record<string, any>>();
    type.value = data.type;
    formApi.setState((prev) => {
      const newSchema = [];
      newSchema.push({
        component: 'Input',
        // 对应组件的参数
        componentProps: {
          placeholder: '请输入标题',
        },
        rules: 'required',
        // 字段名
        fieldName: 'title',
        // 界面显示的label
        label: '标题',
      });
      if (type.value === 'text') {
        newSchema.push({
          component: 'Input',
          fieldName: `content`,
          label: `内容`,
        });
      }
      if (type.value === 'file') {
        newSchema.push({
          component: 'Upload',
          fieldName: `filePath`,
          label: `文件`,
          componentProps: {
            action: '/admin/sys-file/upload',
            limit: 1,
          },
        });
      }
      return {
        schema: [...newSchema],
      };
    });
    formApi.resetForm();
  }
}
</script>
<template>
  <Modal title="创建文档" style="height: 1000px">
    <BaseForm>
      <template #content="slotProps">
        <WngEditor v-bind="slotProps" />
      </template>
    </BaseForm>
  </Modal>
</template>
