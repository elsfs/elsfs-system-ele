<script lang="ts" setup>
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { tableColumnList } from '#/api/developer/table';

import { tableColumnGridOptions as gridOptions } from './table.data';

const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions: {
    ...gridOptions,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async () => {
          return tableColumnList(data.value.dsName, data.value.tableName);
        },
      },
    },
  },
  showSearchForm: true,
});

const data = ref();
const [Modal, modalApi] = useVbenModal({
  class: 'w-[80%] h-[80%]',
  // 显示关闭按钮
  closable: true,
  onCancel() {
    modalApi.close();
  },
  // 显示确认按钮文本
  showConfirmButton: false,
  // 显示取消按钮
  showCancelButton: false,
  onOpenChange,
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    data.value = drawerData.data;
  }
}
</script>

<template>
  <Modal title="数据源">
    <Grid />
  </Modal>
</template>

<style scoped>
/* 样式代码 */
</style>
