<script setup lang="ts">
import type { SysPost } from '#/api/system/sysPost';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';
import { CirclePlus, Recycle, Trash2 } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/system/sysPost';

import RecycleModal from './recycleModal.vue';
import {
  searchFormOptions as formOptions,
  useGridOptions,
} from './sysPost.data';
import SysPostModal from './SysPostModal.vue';

const getCheckboxRecords = ref<SysPost[]>([]);

function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: SysPost[];
}) {
  // 选全部
  getCheckboxRecords.value = checked ? records : [];
}
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions(false),
  formOptions,
  showSearchForm: true,
  gridEvents: {
    checkboxAll,
    checkboxChange: ({ records }: { records: SysPost[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

const [BaseRecycleModal, recycleModalAPi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RecycleModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SysPostModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});

function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}
function openRecycleModal() {
  recycleModalAPi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.postId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.postId, gridApi.reload);
}
function batchDelete() {
  if (getCheckboxRecords.value.length === 0) {
    return;
  }
  useRequestHandle.del(
    getCheckboxRecords.value.map((s) => s.postId),
    gridApi.reload,
  );
  getCheckboxRecords.value = [];
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="职位列表">
      <template #toolbar-actions>
        <el-button type="primary" @click="openModal(null, 'add')">
          <CirclePlus :size="18" />
          新增
        </el-button>
        <el-button
          type="danger"
          @click="batchDelete"
          :disabled="getCheckboxRecords.length === 0"
        >
          <Trash2 :size="18" />
          批量删除
        </el-button>
        <el-button type="success" @click="openRecycleModal()">
          <Recycle :size="18" />
          回收站
        </el-button>
      </template>
      <template #action="{ row }">
        <el-button type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button type="danger" @click="deleteHandle(row)">删除</el-button>
      </template>
    </Grid>
    <Modal @success="gridApi.query()" />
    <BaseRecycleModal @success="gridApi.query()" />
  </Page>
</template>

<style scoped></style>
