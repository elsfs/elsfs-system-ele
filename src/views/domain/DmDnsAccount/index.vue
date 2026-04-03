<script setup lang="ts">
import type { DmDnsAccount } from '#/api/domain/dmDnsAccount';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/domain/dmDnsAccount';
import { TableAction } from '#/components/TableAction';

import {
  searchFormOptions as formOptions,
  useGridOptions,
} from './dmDnsAccount.data';
import BaseModal from './DmDnsAccountModal.vue';

const getCheckboxRecords = ref<DmDnsAccount[]>([]);

function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: DmDnsAccount[];
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
    checkboxChange: ({ records }: { records: DmDnsAccount[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: BaseModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});

function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}

function deleteHandle(row: DmDnsAccount | DmDnsAccount[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.dnsAccountId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.dnsAccountId, gridApi.reload);
}

function batchDelete() {
  if (getCheckboxRecords.value.length === 0) {
    return;
  }
  useRequestHandle.del(
    getCheckboxRecords.value.map((s) => s.dnsAccountId),
    gridApi.reload,
  );
  getCheckboxRecords.value = [];
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              onClick: openModal.bind(null, null, 'add'),
            },
            {
              label: '批量删除',
              type: 'danger',
              onClick: batchDelete.bind(null),
              disabled: getCheckboxRecords.length === 0,
            },
          ]"
        />
      </template>
      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              type: 'primary',
              link: true,
              onClick: openModal.bind(null, row, 'edit'),
            },
            {
              label: '删除',
              link: true,
              type: 'danger',
              onClick: deleteHandle.bind(null, row),
            },
          ]"
        />
      </template>
    </Grid>
    <Modal @success="gridApi.query()" />
  </Page>
</template>

<style scoped>
.days-normal {
  font-weight: 500;
  color: #4caf50;
}

.days-warning {
  font-weight: 600;
  color: #ff9800;
}

.days-critical {
  font-weight: 700;
  color: #f44336;
}
</style>
