<script lang="ts" setup>
import { defineEmits } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/dmIssueCertificate';

const emit = defineEmits<{
  success: [];
}>();
const [Modal, modalApi] = useVbenModal({
  // 显示关闭按钮
  closable: true,
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    modalApi.lock();
    const data = await formApi.getValues();
    try {
      await useRequestHandle.add(data);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  },
  onOpenChange(isOpen) {},
});
const [From, formApi] = useVbenForm({
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
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入域名',
      },
      defaultValue: 'd.jglab.org.cn',
      fieldName: 'domainRaw',
      label: '域名列表',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      fieldName: 'keyType',
      defaultValue: 'ECC',
      label: '加密方式',
      rules: 'required',
      componentProps: {
        options: [
          {
            label: 'RSA',
            value: 'RSA',
          },
          {
            label: 'ECC',
            value: 'ECC',
          },
        ],
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'directoryType',
      defaultValue: 'LE',
      label: '证书厂商',
      rules: 'required',
    },
  ],
});
</script>

<template>
  <Modal>
    <From>
      <template #directoryType="slotProps">
        <el-radio-group v-bind="slotProps">
          <el-radio
            value="LE"
            border
            :class="slotProps.value === 'LE' ? 'bg-blue-500' : ''"
          >
            <img src="/letsEncrypt.png" style="width: 100px" />
          </el-radio>
          <el-radio
            value="ZERO_SSL"
            border
            :class="slotProps.value === 'ZERO_SSL' ? 'bg-blue-500' : ''"
          >
            <img src="/zerossl.png" style="width: 100px" />
          </el-radio>
        </el-radio-group>
      </template>
    </From>
  </Modal>
</template>

<style scoped></style>
