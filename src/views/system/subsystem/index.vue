<script lang="ts" setup>

import type {
  VxeGridApi
} from '@vben/plugins/vxe-table';

import type { SysSubsystem } from '#/api/system/subsystem';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/system/subsystem';

import GenTemplateModal from './GenTemplateModal.vue';
import { gridOptions, searchFormOptions } from './subsystem.data';
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions: searchFormOptions,
  showSearchForm: true,
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: GenTemplateModal,
});
function openModal(row: SysSubsystem) {
  modalApi.setData({
    isUpdate: !!row,
    data: row,
  });
  modalApi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.subsystemId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.subsystemId, gridApi.reload);
}
</script>
<template>
  <div class="p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton type="primary" @click="openModal(null)"> 新增 </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton link type="primary" @click="openModal(row)"> 编辑 </ElButton>
        <ElButton li·nk type="danger" @click="deleteHandle(row)">
          删除
        </ElButton>
      </template>
    </Grid>
    <Modal @refresh="gridApi.reload" />
  </div>
</template>
