<script lang="ts" setup>
import type { DictItem } from './dictItem.data';

import type { SysDict } from '#/api/devOps/dict';

import { reactive, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/devOps/dictItem';

import { schemaFrom } from './dictItem.data';

defineOptions({
  name: 'DictItemDrawer',
});
const emit = defineEmits(['success']);
interface Data {
  dictItem: DictItem;
  dict: SysDict;
}
const isUpdate = ref(false);
const data = reactive<Data>({
  dictItem: {},
  dict: {},
});

const [Form, formApi] = useVbenForm({
  schema: schemaFrom,
  showDefaultActions: false,
  // 提交函数
  handleSubmit,
});
const [Drawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const drawerData = drawerApi.getData<Data>();
      data.dict = drawerData.dict;
      isUpdate.value = drawerData.isUpdate;
      data.dictItem = drawerData.dictItem ?? {};
      if (!data.dictItem.dictId) {
        data.dictItem.dictId = data.dict.dictId;
      }
      formApi.updateSchema([
        {
          component: 'ApiTreeSelect',
          fieldName: 'parentId',
          rules: 'required',
          defaultValue: '0',
          // 对应组件的参数
          componentProps: {
            placeholder: '请输入父级字典项',
            api: async () => {
              const parentData = [];
              const ext = {
                dictItemId: '0',
                label: '根节点',
                children: [] as any[],
              };
              ext.children = await useRequestHandle.tree({
                dictId: data.dict.dictId,
              });
              parentData.push(ext);
              return parentData;
            },
          },
          dependencies: {
            if: false,
          },
        },
      ]);

      formApi.setValues(data.dictItem);
    }
  },
  title: isUpdate.value ? '编辑字典项' : '新增字典项',
});
async function handleSubmit(values: DictItem) {
  const { valid } = await formApi.validate();
  if (!valid) {
    return;
  }
  await (isUpdate.value
    ? useRequestHandle.edit(values)
    : useRequestHandle.add(values));
  drawerApi.close();
  emit('success');
}
</script>
<template>
  <Drawer>
    <Form />
  </Drawer>
</template>
