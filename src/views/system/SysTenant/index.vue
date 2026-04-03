<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/system/sysTenant';

import {
  searchFormOptions as formOptions,
  gridOptions,
} from './sysTenant.data';
import SysPostModal from './SysTenantModal.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
  showSearchForm: true,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SysPostModal,
});

function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}
const reloadTable = () => {
  gridApi.setLoading(true);
  try {
    gridApi.reload({});
  } finally {
    gridApi.setLoading(false);
  }
};
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.menuId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.tenantId, gridApi.reload);
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
        <el-button type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button type="danger" @click="deleteHandle(row)">删除</el-button>
      </template>
    </Grid>
    <Modal @refresh="reloadTable" />
  </div>
</template>

<style scoped></style>
