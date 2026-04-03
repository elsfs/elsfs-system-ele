<script setup lang="ts">
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestRole } from '#/api/core/api';

import { fromSchema } from './role.data';

const emit = defineEmits(['success']);

const isUpdate = ref(false);
const data = ref();
const [BaseForm, formApi] = useVbenForm({
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: fromSchema,
  showDefaultActions: false,
});
const [Modal, modalApi] = useVbenModal({
  // 点击确定按钮的回调
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await (isUpdate.value
          ? useRequestHandle.edit(data)
          : useRequestHandle.add(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  // class: 'w-[60%]',
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

const { useRequestHandle } = useRequestRole;
</script>

<template>
  <Modal :title="isUpdate ? '编辑角色' : '新增角色'">
    <BaseForm />
  </Modal>
</template>

<style scoped></style>
