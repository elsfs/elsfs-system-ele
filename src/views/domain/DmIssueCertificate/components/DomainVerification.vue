<script setup lang="ts">
import type { PropType } from 'vue';

import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { ref, watch } from 'vue';

import { MostlyCloudy, Sell } from '@element-plus/icons-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCertificateChallenges } from '#/api/domain/dmIssueCertificate';

const props = defineProps({
  modelValue: {
    type: Object as PropType<DmIssueCertificate>,
    required: false,
    default: () => ({}),
  },
});

const data = ref([]);
const http01Date = ref([]);
const dns01Data = ref([]);
// 或者使用 watch 同步
watch(
  () => props.modelValue,
  async (newVal) => {
    const res = await getCertificateChallenges(newVal.issueCertificateId);
    res.forEach((item) => {
      if (item.type === 'http-01') {
        http01Date.value.push(item);
      } else {
        dns01Data.value.push(item);
      }
      data.value = http01Date.value;
      gridApi.reload();
    });
  },
  { deep: true, immediate: true },
);
const [Grid, gridApi] = useVbenVxeGrid({
  showSearchForm: false,
  gridOptions: {
    columns: [
      {
        field: 'domainRaw',
        title: '域名',
      },
      {
        field: 'validationStatus',
        title: '验证状态',
        width: 100,
      },
      {
        field: 'statusUrl',
        title: '验证URL',
        width: 100,
      },
      {
        field: 'file',
        title: '验证文件',
        width: 200,
      },
    ],
    proxyConfig: {
      ajax: {
        query: (params) => {
          return Promise.all({
            data: data.value,
          });
        },
      },
    },
    pagerConfig: {
      enabled: false,
    },
  },
});
const verificationType = 'file';
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key);
};
</script>

<template>
  <div>
    <el-menu
      :default-active="verificationType"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="file">
        <el-icon><Sell /></el-icon>
        文件验证
      </el-menu-item>
      <el-menu-item index="dns">
        <el-icon><MostlyCloudy /></el-icon>
        DNS验证
      </el-menu-item>
    </el-menu>
    <Grid />
  </div>
</template>

<style scoped></style>
