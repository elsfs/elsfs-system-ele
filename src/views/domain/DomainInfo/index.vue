<script setup lang="ts">
import type { DomainInfo } from '#/api/domain/domainInfo';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  updateDomainInfo,
  updateWhois,
  useRequestHandle,
} from '#/api/domain/domainInfo';
import { TableAction } from '#/components/TableAction';
import { useMessage } from '#/hooks';

import {
  searchFormOptions as formOptions,
  useGridOptions,
} from './domainInfo.data';
import DomainInfoDescriptions from './DomainInfoDescriptions.vue';
import DomainInfoModal from './DomainInfoModal.vue';

const getCheckboxRecords = ref<DomainInfo[]>([]);

function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: DomainInfo[];
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
    checkboxChange: ({ records }: { records: DomainInfo[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DomainInfoModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});

const [Descriptions, descriptionsApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DomainInfoDescriptions,
  destroyOnClose: true, // 在关闭时销毁弹窗
});
function showDetail(row: any) {
  descriptionsApi.setData(row);
  descriptionsApi.open();
}
function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}

function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.domainInfoId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.domainInfoId, gridApi.reload);
}

function batchDelete() {
  if (getCheckboxRecords.value.length === 0) {
    return;
  }
  useRequestHandle.del(
    getCheckboxRecords.value.map((s) => s.domainInfoId),
    gridApi.reload,
  );
  getCheckboxRecords.value = [];
}
const isDisabled = ref(false);
function updateDomainInfoAll() {
  useMessage().successMessage('后台更新中，刷新查看');
  isDisabled.value = true;
  updateDomainInfo();
}

function updateWhoisInfo(row: DomainInfo) {
  updateWhois(row.domainInfoId, () => {
    gridApi.reload();
    useMessage().successMessage('更新成功');
  });
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
              label: '全部更新',
              icon: 'ant-design:reload-outlined',
              onClick: updateDomainInfoAll.bind(null),
              type: 'primary',
              disabled: isDisabled,
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
              label: '更新',
              icon: 'ant-design:reload-outlined',
              link: true,
              onClick: updateWhoisInfo.bind(null, row),
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
      <template #domain="{ row }">
        <a @click="showDetail(row)" class="text-blue-500">{{ row.domain }}</a>
      </template>
    </Grid>
    <Modal @success="gridApi.query()" />
    <Descriptions />
  </Page>
</template>

<style scoped></style>
