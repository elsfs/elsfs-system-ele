<script lang="ts" setup>
import type { SysDict } from '#/api/devOps/dict';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/devOps/dict';

import { dictSchemaFrom } from './dict.data';

defineOptions({
  name: 'DictModal',
});
const emits = defineEmits(['refresh']);

const isUpdate = ref(false);
const data = ref<SysDict>();
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
  schema: dictSchemaFrom,
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
      const modalData = modalApi.getData<Record<string, any>>();
      isUpdate.value = modalData.isUpdate;
      data.value = modalData.data;
      formApi.setValues(data.value);
    }
  },
});
function handleSubmit(values: SysDict) {
  isUpdate.value ? useRequestHandle.edit(values) : useRequestHandle.add(values);
  modalApi.close();
  emits('refresh');
}
</script>
<template>
  <Modal :title="isUpdate ? '编辑字典' : '新增字典'">
    <BaseForm />
  </Modal>
</template>
