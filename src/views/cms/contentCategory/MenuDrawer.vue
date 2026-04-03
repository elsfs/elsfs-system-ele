<script setup lang="ts">
import { defineEmits, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/cms/contentCategory';
import { useMessage } from '#/hooks/message';

import { formSchema } from './contentCategory.data';

const emits = defineEmits(['refresh']);
const data = ref();
const isUpdate = ref(false);

const [BaseForm, formApi] = useVbenForm({
  // 是否显示默认操作按钮
  showDefaultActions: true,
  schema: formSchema,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  handleReset,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  wrapperClass: 'grid-cols-1',
});
const [Drawer, drawerApi] = useVbenDrawer({
  title: isUpdate.value ? '编辑菜单' : '新增菜单',
  onOpenChange,
  showConfirmButton: false,
});
function onSubmit(values: Record<string, any>) {
  isUpdate.value ? useRequestHandle.edit(values) : useRequestHandle.add(values);
  useMessage().success(isUpdate.value ? '修改成功' : '保存成功');
  drawerApi.close();
  emits('refresh');
}

function handleReset() {
  formApi.setValues(data.value);
}
/**
 * @param {boolean} isOpen - Indicates whether the drawer is open or closed
 * @return {void}
 */
function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = drawerApi.getData<Record<string, any>>();
    isUpdate.value = !!drawerData.isUpdate;
    data.value = drawerData.data;
    formApi.setValues(data.value);
  }
}
</script>
<template>
  <Drawer>
    <BaseForm />
  </Drawer>
</template>
