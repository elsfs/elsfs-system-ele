<script setup lang="ts">

import {ref} from "vue";

import {useVbenModal} from '@vben/common-ui';

import {Description} from "#/components/description";

const data = ref({})
const schema = [
  {field: 'operationLogId', label: 'ID'},
  {field: 'userId', label: '操作用户ID'},
  {field: 'username', label: '操作用户名'},
  {field: 'module', label: '操作模块'},
  {field: 'operationType', label: '操作类型'},
  {field: 'description', label: '操作描述'},
  {field: 'requestMethod', label: '请求方法'},
  {field: 'requestUrl', label: '请求URL'},
  {field: 'requestParams', label: '请求参数'},
  {field: 'responseData', label: '响应数据'},
  {field: 'ip', label: 'IP地址'},
  {field: 'deviceInfo', label: '设备信息'},
  {field: 'executeTime', label: '执行时长（毫秒）'},
  {field: 'status', label: '操作状态'},
  {field: 'errorMsg', label: '错误信息'},
  {field: 'createAt', label: '操作时间'},
];
const [Modal, modalApi] = useVbenModal({
  onOpenChange,
  closable: true,
  showConfirmButton: false,
  class: 'w-full',
})

function onOpenChange(isOpen: boolean) {
  if (!isOpen) {
    return
  }
  data.value = modalApi.getData().data;
}
</script>

<template>
  <Modal title="日志详情">
    <Description :data="data" :schema="schema" />
  </Modal>
</template>
