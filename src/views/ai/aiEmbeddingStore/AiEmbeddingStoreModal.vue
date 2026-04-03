<script lang="ts" setup>
import type { AiEmbeddingStore } from '#/api/ai/aiEmbeddingStore';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/ai/aiEmbeddingStore';

import { formSchema } from './aiEmbeddingStore.data';

const emits = defineEmits(['refresh']);

const isUpdate = ref(false);
const data = ref<AiEmbeddingStore>({
  storeId: '',
  confType: '',
  name: '',
  storeType: '',
  apiKey: '',
  url: '',
  host: '',
  port: '',
  extData: '',
  status: '',
  pinyinCode: '',
  wubiCode: '',
});
const [Modal, modalApi] = useVbenModal({
  // 显示关闭按钮
  closable: true,
  onCancel() {
    modalApi.close();
  },
  // 显示确认按钮文本
  showConfirmButton: false,
  // 显示取消按钮
  showCancelButton: false,
  onOpenChange,
});
const [BaseForm, formApi] = useVbenForm({
  // 是否显示默认操作按钮
  showDefaultActions: true,
  schema: formSchema,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  wrapperClass: 'grid-cols-1',
  handleSubmit,
  handleReset,
});
async function handleSubmit(values: AiEmbeddingStore) {
  isUpdate.value
    ? await useRequestHandle.edit(values)
    : await useRequestHandle.add(values);
  modalApi.close();
  emits('refresh');
}
function handleReset() {
  formApi.setValues(data.value);
}
async function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    isUpdate.value = !!drawerData.isUpdate;
    if (drawerData?.data?.storeId) {
      data.value = await useRequestHandle.getById(drawerData.data.storeId);
    }
    formApi.setValues(data.value);
  }
}
</script>

<template>
  <Modal title="向量配置"> <BaseForm /> </Modal>
</template>

<style scoped>
/* 样式代码 */
</style>
