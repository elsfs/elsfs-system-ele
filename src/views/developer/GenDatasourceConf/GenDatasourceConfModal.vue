<script lang="ts" setup>
import type { SysConfig } from '#/api/devOps/sysConfig';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/developer/genDatasourceConf';
import { useMessage } from '#/hooks/message';

import { formSchema } from './genDatasourceConf.data';

const emits = defineEmits(['refresh']);

const isUpdate = ref(false);
const data = ref<SysConfig>({});
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
async function handleSubmit(values: SysConfig) {
  isUpdate.value ? useRequestHandle.edit(values) : useRequestHandle.add(values);
  useMessage().success(isUpdate.value ? '修改成功' : '保存成功');
  modalApi.close();
  emits('refresh');
}
function handleReset() {
  formApi.setValues(data.value);
}
function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    isUpdate.value = !!drawerData.isUpdate;
    data.value = drawerData.data;
    formApi.setValues(data.value);
  }
}
</script>

<template>
  <Modal title="数据源"> <BaseForm /> </Modal>
</template>

<style scoped>
/* 样式代码 */
</style>
