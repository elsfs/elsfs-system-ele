<script lang="ts" setup>
import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useMessage } from '#/hooks/message';

import ApplyCertificate from './components/ApplyCertificate.vue';
import DmIssueCertificateStep from './components/DmIssueCertificateStep.vue';
import DomainVerification from './components/DomainVerification.vue';

type Type = 'add' | 'pending';
const emit = defineEmits<{
  success: [];
}>();
const { success } = useMessage();
const type = ref<Type>('add');
const formData = ref<DmIssueCertificate>();
const currentTab = ref(1);
const domainVerificationProps = ref<DmIssueCertificate>({});

const [Modal, modalApi] = useVbenModal({
  onOpenChange,
  // 显示关闭按钮
  closable: true,
  showCancelButton: false,
  showConfirmButton: false,
  class: 'w-[60%] h-[70%]',
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<{
      data: DmIssueCertificate;
      type: Type;
    }>();
    type.value = drawerData.type;
    if (type.value === 'pending') {
      currentTab.value = 2;
      domainVerificationProps.value = drawerData.data;
    }
  }
}

function onSecondReset() {
  currentTab.value = 0;
}
function onSecondSubmit(values: Record<string, any>) {
  success({
    content: `form2 values: ${JSON.stringify(values)}`,
  });
}

const [SecondForm, secondFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onSecondReset,
  handleSubmit: onSecondSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'formSecond',
      label: '表单2字段',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});

function applyCertificateHandler(row: DmIssueCertificate) {
  currentTab.value = 2;
  domainVerificationProps.value = row;
}
// 步骤
const dmIssueCertificateActive = ref(1);
</script>
<template>
  <Modal title="申请SSL证书">
    <div class="mx-auto max-w-lg">
      <DmIssueCertificateStep :active="dmIssueCertificateActive" />
    </div>
    <div class="p-200">
      <ApplyCertificate
        class="mx-auto max-w-lg"
        v-if="currentTab === 1"
        @apply="applyCertificateHandler"
      />
      <DomainVerification
        v-model="domainVerificationProps"
        v-if="currentTab === 2"
        @apply="currentTab = 3"
      />
    </div>
  </Modal>
</template>
<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 35px;
}
</style>
