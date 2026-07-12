<script setup lang="ts">
import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { defineEmits } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/dmIssueCertificate';

const emit = defineEmits<{
  apply: [];
}>();
const [From, firstFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: async (values: DmIssueCertificate) => {
    const res = await useRequestHandle.add(values);
    emit('apply', res);
  },
  layout: 'horizontal',
  submitButtonOptions: {
    content: '确定',
  },
  resetButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入域名列表，一行一个',
        rows: 6,
        type: 'textarea',
      },
      defaultValue: 'd.jglab-host.org.cn',
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
  <From>
    <template #directoryType="slotProps">
      <el-radio-group v-bind="slotProps">
        <el-radio
          label="LE"
          border
          :class="slotProps.value === 'LE' ? 'bg-blue-500' : ''"
        >
          <img src="/letsEncrypt.png" style="width: 100px" />
        </el-radio>
        <el-radio
          label="ZERO_SSL"
          border
          :class="slotProps.value === 'ZERO_SSL' ? 'bg-blue-500' : ''"
        >
          <img src="/zerossl.png" style="width: 100px" />
        </el-radio>
      </el-radio-group>
    </template>
  </From>
</template>

<style scoped></style>
