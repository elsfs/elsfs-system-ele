<script setup lang="ts">
import type { SysConfig } from './sysConfig.api';

import { ref} from 'vue';

import { Page } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { searchFormOptions as formOptions, gridOptions } from './config.data';
import ConfigDialog from  './ConfigDialog.vue';
import { useRequestHandle } from './sysConfig.api';

const  configDialogRef = ref();
const getCheckboxRecords = ref<SysConfig[]>([]);
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  showSearchForm: true,
  gridEvents: {
    checkboxAll: ({
      checked,
      records,
    }: {
      checked: boolean;
      records: SysConfig[];
    }) => {
      // 选全部
      getCheckboxRecords.value = checked ? records : [];
    },
    checkboxChange: ({ records }: { records: SysConfig[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});


function openModal(row: null | SysConfig, type: 'add' | 'edit') {
  configDialogRef.value.openDialog(row?.configId)
}
function deleteHandle(row: SysConfig | SysConfig[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.configId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.configId, gridApi.reload);
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <el-button type="primary" @click="openModal(null, 'add')">
          新增
        </el-button>
        <el-button type="danger" :disabled="getCheckboxRecords.length === 0">
          批量删除
        </el-button>
      </template>
      <template #action="{ row }">
        <el-button type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button type="danger" @click="deleteHandle(row)">删除</el-button>
      </template>
    </Grid>
    <ConfigDialog ref="configDialogRef" @refresh="gridApi.query()" />
  </Page>
</template>

<style scoped></style>
