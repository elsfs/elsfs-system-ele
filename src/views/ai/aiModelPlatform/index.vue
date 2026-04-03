<script lang="ts" setup>
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import type { AiModelPlatform } from '#/api/ai/aiModelPlatform';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/ai/aiModelPlatform';

import { gridOptions, searchFormOptions } from './aiModelPlatform.data';
import AiModelPlatformModal from './AiModelPlatformModal.vue';

const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions: searchFormOptions,
  showSearchForm: true,
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AiModelPlatformModal,
});
function openModal(row: AiModelPlatform) {
  modalApi.setData({
    isUpdate: !!row,
    data: row,
  });
  modalApi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.platformId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.platformId, gridApi.reload);
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
        <ElButton link type="danger" @click="deleteHandle(row)">
          删除
        </ElButton>
      </template>
    </Grid>
    <Modal @refresh="gridApi.reload" />
  </div>
</template>
