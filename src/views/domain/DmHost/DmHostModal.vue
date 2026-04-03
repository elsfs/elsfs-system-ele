<script lang="ts" setup>
import type { DmHost } from '#/api/domain/dmHost';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/dmHost';

import { formSchema } from './dmHost.data';

const emit = defineEmits<{
  success: [];
}>();

const isUpdate = ref(false);
const formData = ref<DmHost>();
const [Form, formApi] = useVbenForm({
  // 是否显示默认操作按钮
  showDefaultActions: false,
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-1',
  layout: 'horizontal',
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
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<{
      data: DomainInfo;
      isUpdate: boolean;
    }>();
    isUpdate.value = drawerData.isUpdate;

    const redDate = drawerData.data;
    if (redDate) {
      // // 域名开始时间 域名到期时间
      redDate.domainTime = [redDate.domainStartTime, redDate.domainExpireTime];
    }
    formData.value = redDate;
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
