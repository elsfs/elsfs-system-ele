<script lang="ts" setup>
import type { DmDnsAccount } from '#/api/domain/dmDnsAccount';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/dmDnsAccount';

import { formSchema } from './dmDnsAccount.data';

const emit = defineEmits<{
  success: [];
}>();

const isUpdate = ref(false);
const formData = ref<DmDnsAccount>();
const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  // 是否显示默认操作按钮
  showDefaultActions: false,
  schema: formSchema,
});
function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}

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
  class: 'w-[60%]',
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<{
      data: DomainInfo;
      isUpdate: boolean;
    }>();
    isUpdate.value = drawerData.isUpdate;
    formData.value = drawerData.data;
    formApi.setValues(formData.value);
  }
}
</script>
<template>
  <Modal title="域名详情编辑">
    <Form class="mx-4" />

    <template #prepend-footer>
      <div class="flex-auto">
        <ElButton type="primary" danger @click="resetForm"> 重置 </ElButton>
      </div>
    </template>
  </Modal>
</template>
