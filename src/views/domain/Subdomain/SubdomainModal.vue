<script lang="ts" setup>
import type { Subdomain } from '#/api/domain/subdomain';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/subdomain';

import { formSchema } from './subdomain.data';

const emit = defineEmits<{
  success: [];
}>();

const isUpdate = ref(false);
const formData = ref<Subdomain>();
const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  // 是否显示默认操作按钮
  showDefaultActions: false,
  schema: formSchema,
  fieldMappingTime: [
    [
      'domainTime',
      ['domainStartTime', 'domainExpireTime'], // 域名开始时间 域名到期时间
      'YYYY-MM-DD 00:00:00',
    ],
  ],
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
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<{
      data: Subdomain;
      isUpdate: boolean;
    }>();
    isUpdate.value = drawerData.isUpdate;
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
