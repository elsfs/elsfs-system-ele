<script lang="ts" setup>
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import type { AiEmbeddingStore } from '#/api/ai/aiEmbeddingStore';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/ai/aiEmbeddingStore';

import { gridOptions, searchFormOptions } from './aiEmbeddingStore.data';
import AiEmbeddingStoreModal from './AiEmbeddingStoreModal.vue';

const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions: searchFormOptions,
  showSearchForm: true,
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AiEmbeddingStoreModal,
});
function openModal(row: AiEmbeddingStore) {
  modalApi.setData({
    isUpdate: !!row,
    data: row,
  });
  modalApi.open();
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
