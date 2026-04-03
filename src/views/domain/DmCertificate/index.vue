<script setup lang="ts">
import type { DmCertificate } from '#/api/domain/dmCertificate';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import dayjs from 'dayjs';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/domain/dmCertificate';
import { TableAction } from '#/components/TableAction';

import {
  searchFormOptions as formOptions,
  useGridOptions,
} from './dmCertificate.data';
import DomainInfoModal from './DmCertificateModal.vue';

const getCheckboxRecords = ref<DmCertificate[]>([]);

function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: DmCertificate[];
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
    checkboxChange: ({ records }: { records: DmCertificate[] }) => {
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
      row.map((s) => s.certificateId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.certificateId, gridApi.reload);
}

function batchDelete() {
  if (getCheckboxRecords.value.length === 0) {
    return;
  }
  useRequestHandle.del(
    getCheckboxRecords.value.map((s) => s.certificateId),
    gridApi.reload,
  );
  getCheckboxRecords.value = [];
}
// 根据剩余天数返回 CSS class
const certDaysClass = (cert) => {
  const expireTime = dayjs(cert.expireTime);
  const remainingDays = expireTime.diff(dayjs(), 'day');

  if (remainingDays < 7) return 'days-critical';
  if (remainingDays < 30) return 'days-warning';
  return 'days-normal';
};
// 计算天数带颜色状态
const computeCertDays = (cert) => {
  const expireTime = dayjs(cert.expireTime);
  const startTime = dayjs(cert.startTime);
  const now = dayjs();

  const totalDays = expireTime.diff(startTime, 'day'); // 总天数
  const usedDays = now.diff(startTime, 'day'); // 已使用的天数
  const remainingDays = expireTime.diff(now, 'day'); // 剩余天数
  // const safeUsedDays = Math.min(Math.max(0, usedDays), totalDays); // 已使用的天数（取范围 [0, totalDays]）

  return `${remainingDays} / ${totalDays}`;
};
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
      <template #domain="{ row }">
        <a
          :href="`https://${row.domain}`"
          class="text-primary"
          target="_blank"
          >{{ row.domain }}</a
        >
      </template>
      <template #sslCertificateDay="{ row }">
        <span :class="certDaysClass(row)">
          {{ computeCertDays(row) }}
        </span>
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
