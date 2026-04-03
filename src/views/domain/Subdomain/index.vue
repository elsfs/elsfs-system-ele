<script setup lang="ts">
import type { Subdomain } from '#/api/domain/subdomain';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  updateAllDomainCertInfo,
  updateAllDomainCertInfoBySubdomainId,
  useRequestHandle,
} from '#/api/domain/subdomain';
import { TableAction } from '#/components/TableAction';
import { useMessage } from '#/hooks';

import AddressList from '../Address/index.vue';
import DomainInfoDescriptions from './DomainInfoDescriptions.vue';
import {
  searchFormOptions as formOptions,
  useGridOptions,
} from './subdomain.data';
import SubdomainModal from './SubdomainModal.vue';

const getCheckboxRecords = ref<Subdomain[]>([]);

function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: Subdomain[];
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
    checkboxChange: ({ records }: { records: Subdomain[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SubdomainModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});
const [AddressListModal, addressListApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AddressList,
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
function openAddressList(row: any) {
  addressListApi.setData(row);
  addressListApi.open();
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
      row.map((s) => s.subdomainId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.subdomainId, gridApi.reload);
}

function batchDelete() {
  if (getCheckboxRecords.value.length === 0) {
    return;
  }
  useRequestHandle.del(
    getCheckboxRecords.value.map((s) => s.subdomainId),
    gridApi.reload,
  );
  getCheckboxRecords.value = [];
}
const isDisabled = ref(false);
function updateAllDomainCertInf0() {
  useMessage().successMessage('后台更新中，刷新查看');
  isDisabled.value = true;
  updateAllDomainCertInfo();
}
function updateAllDomainCertInfoBySubdomainIdHandle(row: Subdomain) {
  updateAllDomainCertInfoBySubdomainId(row.subdomainId, gridApi.reload);
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
              onClick: updateAllDomainCertInf0.bind(null),
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
              type: 'primary',
              link: true,
              onClick: updateAllDomainCertInfoBySubdomainIdHandle.bind(
                null,
                row,
              ),
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
      <template #subdomainName="{ row }">
        <a @click="showDetail(row)" class="text-blue-500">{{
          row.subdomainName
        }}</a>
      </template>
      <template #hostCount="{ row }">
        <a @click="openAddressList(row)" class="text-blue-500">{{
          row.hostCount
        }}</a>
      </template>
    </Grid>
    <Modal @success="gridApi.query()" />
    <AddressListModal @closed="gridApi.query()" />
    <Descriptions />
  </Page>
</template>

<style scoped></style>
