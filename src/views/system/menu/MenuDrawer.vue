<script setup lang="ts">
import type { SysMenu } from '#/api/system/menu';

import { computed, defineEmits, reactive } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';

import { useVbenForm } from '#/adapter/form';
import {
  defaultComponentName,
  MenuType,
  useRequestHandle,
} from '#/api/system/menu';

import { formSchema } from './menu.data';

const emit = defineEmits<{
  success: [];
}>();
interface DrawerApiOptions {
  isUpdate?: boolean;
  data?: SysMenu;
  menuType?: MenuType;
}
const drawerData = reactive<DrawerApiOptions>({
  data: undefined,
  isUpdate: false,
  menuType: MenuType.CATALOG,
});
const breakpoints = useBreakpoints(breakpointsTailwind);
const isHorizontal = computed(() => breakpoints.greaterOrEqual('md').value);

const [BaseForm, formApi] = useVbenForm({
  schema: formSchema,
  commonConfig: {
    colon: true,
    formItemClass: 'col-span-2 md:col-span-1',
  },
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2 gap-x-4',
  // handleSubmit: onSubmit,
  // handleReset,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
});
const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: onSubmit,
  onOpenChange,
});
async function onSubmit() {
  const { valid } = await formApi.validate();
  if (valid) {
    drawerApi.lock();
    const values = await formApi.getValues();
    try {
      await (drawerData.isUpdate
        ? useRequestHandle.edit(values)
        : useRequestHandle.add(values));
      drawerApi.close();
      emit('success');
    } finally {
      drawerApi.unlock();
    }
  }
}

/**
 * @param {boolean} isOpen - Indicates whether the drawer is open or closed
 * @return {void}
 */
function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const openData = drawerApi.getData<DrawerApiOptions>();
    drawerData.isUpdate = !!openData.isUpdate;
    drawerData.data = openData.data;
    drawerData.menuType = openData.menuType ?? MenuType.CATALOG;
    if (drawerData.isUpdate) {
      formApi.setValues(drawerData.data as Record<string, any>);
    } else {
      formApi.resetForm();
      formApi.setFieldValue('type', drawerData.menuType);
      if (drawerData.data?.parentId) {
        formApi.setFieldValue('parentId', drawerData.data.parentId);
        formApi.setFieldValue('type', MenuType.MENU);
      }
      if (drawerData.menuType === MenuType.CATALOG) {
        formApi.setFieldValue('component', defaultComponentName);
      }
    }
  }
}
// 获取抽屉标题
const getDrawerTitle = computed(() =>
  drawerData.isUpdate ? '更新菜单' : '新增菜单',
);
</script>
<template>
  <Drawer class="w-full max-w-[800px]" :title="getDrawerTitle">
    <BaseForm class="mx-4" :layout="isHorizontal ? 'horizontal' : 'vertical'" />
  </Drawer>
</template>
