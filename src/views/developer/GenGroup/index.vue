<script setup lang="ts">
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import { useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/developer/genGroup';

import { searchFormOptions as formOptions, gridOptions } from './genGroup.data';
import GenGroupModal from './GenGroupModal.vue';

const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  showSearchForm: true,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: GenGroupModal,
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
</script>

<template>
  <div class="p-5">
    <Grid>
      <template #toolbar-actions>
        <el-button type="primary" @click="openModal(null, 'add')">
          新增
        </el-button>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button link type="danger" @click="deleteHandle(row)">
          删除
        </el-button>
      </template>
    </Grid>
    <Modal @refresh="reloadTable" />
  </div>
</template>

<style scoped></style>
