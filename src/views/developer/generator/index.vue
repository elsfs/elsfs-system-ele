<script setup lang="ts">
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Files } from '@element-plus/icons-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useMessage } from '#/hooks';

import {
  searchFormOptions as formOptions,
  gridOptions,
} from './generator.data';
import GeneratorModal from './GeneratorModal.vue';

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
  connectedComponent: GeneratorModal,
});
function openModal(row) {
  modalApi.setData({
    data: row,
  });
  modalApi.open();
}
</script>

<template>
  <div class="p-5">
    <Grid>
      <template #toolbar-actions> </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="openModal(row)">
          生成
          <el-icon class="ml-1">
            <Files />
          </el-icon>
        </el-button>
      </template>
    </Grid>
    <Modal />
  </div>
</template>

<style scoped></style>
