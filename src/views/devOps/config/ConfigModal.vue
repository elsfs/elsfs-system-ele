<script lang="ts" setup>
import type { SysConfig } from '#/api/devOps/sysConfig';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/devOps/sysConfig';
import { useMessage } from '#/hooks/message';

import { formSchema } from './config.data';

const emit = defineEmits<{
  success: [];
}>();
const isUpdate = ref(false);
const data = ref<SysConfig>({});
const [Modal, modalApi] = useVbenModal({
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
  onOpenChange,
  // 显示关闭按钮
  closable: true,
});
const [BaseForm, formApi] = useVbenForm({
  layout: 'horizontal',
  // 是否显示默认操作按钮
  showDefaultActions: false,
  schema: formSchema,
  wrapperClass: 'grid-cols-1',
});
async function handleSubmit(values: SysConfig) {
  isUpdate.value ? useRequestHandle.edit(values) : useRequestHandle.add(values);
  useMessage().success(isUpdate.value ? '修改成功' : '保存成功');
  modalApi.close();
  emit('success');
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
  <Modal title="配置参数"> <BaseForm /> </Modal>
</template>

<style scoped>
/* 样式代码 */
</style>
