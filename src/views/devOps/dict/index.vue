<script setup lang="ts">
import type { SysDict } from '#/api/devOps/dict';

import { Page, useVbenModal } from '@vben/common-ui';

import { AddLocation, Delete, Edit, View } from '@element-plus/icons-vue';
import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/devOps/dict';
import { useDict } from '#/utils/dictUtils';

import DictItemModal from './components/DictItemModal.vue';
import { dictGridOptions, dictSearchFormOptions } from './dict.data';
import DictModal from './DictModal.vue';

const { status } = useDict('status');
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DictModal,
});
const [DictItemModalComponent, dictItemModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DictItemModal,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: dictSearchFormOptions,
  gridOptions: dictGridOptions,
  showSearchForm: true,
});

/**
 * 计算label
 * @param type 类型
 */
function tagLabel(type: string) {
  const item = status.value.find((item) => item.value === type);
  return item ? item.label : '未配置'; // 默认标签文本为 '未知类型'
}

/**
 * 计算标签类型
 * @param type 类型
 */
function tagType(type: string) {
  const item = status.value.find((item) => item.value === type);
  return item ? item.type : '未配置'; // 默认标签文本为 '未知类型'}
}
function openDictItemModal(row: SysDict) {
  dictItemModalApi.setData(row);
  dictItemModalApi.open();
}
const deleteHandle = async (row: SysDict) => {
  await useRequestHandle.del(row.dictId, gridApi.reload);
};
function openModal(row: null | SysDict) {
  modalApi.setData({
    isUpdate: !!row?.dictId,
    data: row,
  });
  modalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <el-button type="primary" @click="openModal(null)">
          <el-icon><AddLocation /></el-icon>
          新增
        </el-button>
      </template>
      <template #dictName="{ row }">
        <span class="hover-card" style="font-style: italic">
          <span class="mr10">
            {{ row.dictName }}
          </span>
          <ElTag :type="tagType(row.status)">
            {{ tagLabel(row.status) }}
          </ElTag>
          <ElTag :type="row.isTree ? 'primary' : 'success'">
            {{ row.isTree ? '树形' : '表格' }}
          </ElTag>
        </span>
      </template>
      <template #action="{ row }">
        <el-button size="small" type="primary" @click="openModal(row)">
          <el-icon><Edit /></el-icon>
        </el-button>
        <ElButton color="#00c6fb" size="small" @click="openDictItemModal(row)">
          <el-icon><View /></el-icon>
        </ElButton>
        <el-button size="small" type="danger" @click="deleteHandle(row)">
          <el-icon><Delete /></el-icon>
        </el-button>
      </template>
    </Grid>
    <Modal @refresh="gridApi.reload()" />
    <DictItemModalComponent />
  </Page>
</template>

<style scoped></style>
