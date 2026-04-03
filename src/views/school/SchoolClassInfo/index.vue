<script lang="ts" setup>
import type { SchoolClassInfo } from './SchoolClassInfo.data';

import { useVbenModal } from '@vben/common-ui';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/cms/contentCategory';

import AddSchoolClassInfoModal from './AddSchoolClassInfoModal.vue';
import { gridOptions, searchFormOptions } from './SchoolClassInfo.data';
import SchoolClassInfoEditModal from './SchoolClassInfoEditModal.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions,
  showSearchForm: true,
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SchoolClassInfoEditModal,
});
const [AddModal, addModalApi] = useVbenModal({
  connectedComponent: AddSchoolClassInfoModal,
});
function openHandle(row: SchoolClassInfo) {
  modalApi.setData(row);
  modalApi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.categoryId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.categoryId, gridApi.reload);
}
const openAddModal = () => {
  addModalApi.open();
};
const reloadTable = () => {
  gridApi.setLoading(true);
  try {
    gridApi.reload({});
  } finally {
    gridApi.setLoading(false);
  }
};
</script>

<template>
  <div class="vp-raw h-[300px] w-full p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-1" type="primary" @click="openAddModal">
          新增
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton text type="primary" @click="openHandle(row)"> 编辑 </ElButton>
        <ElButton text type="danger" @click="deleteHandle(row)">
          删除
        </ElButton>
      </template>
    </Grid>
    <Modal />
    <AddModal />
  </div>
</template>
