<script setup lang="ts">
import type { VxeGridPropTypes } from 'vxe-table';

import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';
import type { ActionItem } from '#/components/TableAction';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { TopLeft } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { merge } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  generateVerification,
  useRequestHandle,
} from '#/api/domain/dmIssueCertificate';
import { TableAction } from '#/components/TableAction';

import FileVerification from './components/FileVerification.vue';
import DmIssueCertificateDialog from './DmIssueCertificateDialog.vue';
import DmIssueCertificateModal from './DmIssueCertificateModal.vue';

const radio = ref('草稿');
dayjs.extend(relativeTime);

const columns: VxeGridPropTypes.Columns<DmIssueCertificate> = [
  {
    field: 'domainRaw',
    title: '域名',
  },
  {
    field: 'keyType',
    title: '加密方式',
  },
  {
    field: 'directoryType',
    title: '证书提供商',
  },
  {
    field: 'validationStatus',
    title: '验证状态',
    slots: { default: 'validationStatus' },
  },
  {
    field: 'remark',
    title: '备注',
  },
  {
    field: 'createAt',
    title: '创建时间',
    formatter: ({ cellValue }) => {
      return dayjs(cellValue).fromNow();
    },
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];
const qry = {
  validationStatus: '0',
};
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    keepSource: true,
    columns,
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async (_, formValues) => {
          return useRequestHandle.page(merge(formValues));
        },
      },
    },
  },
  showSearchForm: true,
});

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DmIssueCertificateModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});
const [BaseFileVerification, fileVerificationApi] = useVbenModal({
  // 抽离的组件
  connectedComponent: FileVerification,
  destroyOnClose: true, // 在关闭时销毁弹窗
  class: 'w-[60%]',
});
function openModal() {
  modalApi.open();
}
// 生成验证
async function generateVerificationHanandle(row: DmIssueCertificate) {
  await generateVerification(row.issueCertificateId);
  qry.validationStatus = '1';
  radio.value = '待验证';
  gridApi.reload();
}
function openFileVerification(row: DmIssueCertificate) {
  fileVerificationApi.setData({
    data: row,
  });
  fileVerificationApi.open();
}
function tableAction(row: DmIssueCertificate): ActionItem[] {
  if (radio.value === '草稿') {
    return [
      {
        label: '生成验证',
        type: 'primary',
        onClick: generateVerificationHanandle.bind(null, row),
        link: true,
      },
      {
        label: '取消',
        type: 'danger',
        link: true,
      },
    ];
  }
  if (radio.value === '待验证') {
    return [
      {
        label: '文件验证',
        type: 'primary',
        onClick: openFileVerification.bind(null, row),
        link: true,
      },
      {
        label: 'dns验证',
        type: 'primary',
        onClick: generateVerificationHanandle.bind(null, row),
        link: true,
      },
      {
        label: '取消',
        type: 'danger',
        link: true,
      },
    ];
  }
  return [];
}
const formDialogRef = ref();
const showTag = (row) => {
  if (row.validationStatus === '1') {
    return '待验证';
  }
  if (row.validationStatus === '2') {
    return '已签发';
  }
  if (row.validationStatus === '3') {
    return '已部署';
  }
};
</script>
<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <el-button
          @click="formDialogRef.openDialog()"
          class="ml-2"
          type="primary"
        >
          新增
        </el-button>
      </template>
      <template #validationStatus="{ row }">
        <ElButton type="primary" link @click="formDialogRef.openDialog(row)">
          <el-icon size="18" color="#DB7014FF"><TopLeft /></el-icon>
          {{ showTag(row) }}
        </ElButton>
      </template>
      <template #action="{ row }">
        <TableAction :actions="tableAction(row)" />
      </template>
    </Grid>
    <Modal @success="gridApi.reload()" />
    <BaseFileVerification />
    <DmIssueCertificateDialog ref="formDialogRef" />
  </Page>
</template>

<style scoped></style>
