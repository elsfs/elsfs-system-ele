<script lang="ts" setup>
import type { SchoolClassInfo } from './SchoolClassInfo.data';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/devOps/dict';

import { schemaFrom } from './SchoolClassInfo.data';

defineOptions({
  name: 'SchoolClassInfoEditModal',
});
const data = ref<SchoolClassInfo>();
const [BaseForm, formApi] = useVbenForm({
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
  // 是否显示默认操作按钮
  showDefaultActions: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    colon: true, // 在Label后显示一个冒号
    labelWidth: 150,
  },
  compact: false,
  // 提交函数
  handleSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: schemaFrom,
  // 表单重置回调
  handleReset: () => {
    formApi.setValues(data.value);
  },
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  // 点击确定按钮的回调
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  class: 'w-[60%]',
  // 是否自动聚焦
  openAutoFocus: true,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
      formApi.setValues(data.value);
    }
  },
});
function handleSubmit(values: SchoolClassInfo) {
  useRequestHandle.edit(values);
  modalApi.close();
}
</script>
<template>
  <Modal title="编辑">
    <BaseForm />
  </Modal>
</template>
