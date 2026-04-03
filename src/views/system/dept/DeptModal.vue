<script setup lang="ts">
import { computed, defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestDept } from '#/api/core/api';
import { useMessage } from '#/hooks/message';

import { formSchema } from './dept.data';

const emits = defineEmits(['refresh']);
const { useRequestHandle } = useRequestDept;
const isUpdate = ref(false);
const data = ref<Record<string, any>>({});
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
  // layout: 'horizontal',
  wrapperClass: 'grid-cols-1',
  handleSubmit(values: Record<string, any>) {
    isUpdate.value
      ? useRequestHandle.edit(values)
      : useRequestHandle.add(values);
    useMessage().success(isUpdate.value ? '修改成功' : '保存成功');
    modalApi.close();
    emits('refresh');
  },
  handleReset() {
    formApi.setValues(data.value);
  },
});
const title = computed(() => {
  return isUpdate.value ? '修改部门' : '新增部门';
});
async function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    isUpdate.value = !!drawerData.isUpdate;
    data.value = null;
    if (drawerData.deptId) {
      data.value = await useRequestHandle.getById(drawerData.deptId);
    }
    formApi.setValues(data.value);
  }
}
</script>

<template>
  <Modal :title="title">
    <BaseForm />
  </Modal>
</template>

<style scoped></style>
