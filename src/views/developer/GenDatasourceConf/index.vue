<script setup lang="ts">
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { docHtml, useRequestHandle } from '#/api/developer/genDatasourceConf';
import { useMessage } from '#/hooks';

import {
  searchFormOptions as formOptions,
  gridOptions,
} from './genDatasourceConf.data';
import GenDatasourceConfModal from './GenDatasourceConfModal.vue';

const getCheckboxRecords = ref([]);
const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  showSearchForm: true,
  gridEvents: {
    checkboxAll: ({ checked, records }) => {
      records
        .filter((c) => c.configType === '0')
        .map((r) => gridApi.grid.setCheckboxRow(r));
      // 选全部
      getCheckboxRecords.value = checked ? records : [];
    },
    checkboxChange: ({ records }) => {
      for (const valueElement of records) {
        if (valueElement.configType === '0') {
          useMessage().errorMessage('系统配置不能删除');
          gridApi.grid.setCheckboxRow(valueElement);
        }
      }
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: GenDatasourceConfModal,
});

function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}
async function reloadTable() {
  await gridApi.reload();
  await gridApi.grid.reloadData(gridApi.grid.getData());
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.id),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.id, gridApi.reload);
}
async function openDoc(row: any) {
  docHtml(row.dsName);
}
</script>

<template>
  <div class="p-5">
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
        <el-button link type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button link type="danger" @click="deleteHandle(row)">
          删除
        </el-button>
        <el-button link type="primary" @click="openDoc(row)">文档</el-button>
      </template>
    </Grid>
    <Modal @refresh="reloadTable" />
  </div>
</template>

<style scoped></style>
