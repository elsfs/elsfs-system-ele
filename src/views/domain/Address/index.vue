<script setup lang="ts">
import type { Subdomain } from '#/api/domain/subdomain';

import { defineEmits, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { TableAction } from '#/components/TableAction';

import { useGridOptions } from './address.data';
import AddressModal from './AddressModal.vue';

const emit = defineEmits<{
  closed: [];
}>();
const subdomain = ref<Subdomain>();

const [Modal, modalApi] = useVbenModal({
  footer: false,
  fullscreenButton: false, // 全屏按钮
  class: 'w-[70%] h-[60%]',
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      subdomain.value = modalApi.getData<Subdomain>();
    }
  },
  onOpened() {
    gridApi.query({
      subdomainId: subdomain.value?.subdomainId,
    });
  },
  onClosed() {
    emit('closed');
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions(false),
});
const [BaseAddressModal, addressModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: AddressModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});

function openAddressModal() {
  addressModalApi.setData({
    isUpdate: false,
    subdomain: subdomain.value,
  });
  addressModalApi.open();
}
</script>

<template>
  <Modal>
    <Grid>
      <template #toolbar-actions>
        <TableAction
          :actions="[
            {
              label: '新增',
              type: 'primary',
              onClick: openAddressModal.bind(null),
            },
          ]"
        />
      </template>

      <template #action="{ row }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:reload-outlined',
              type: 'primary',
              link: true,
            },
            {
              icon: 'ant-design:edit-outlined',
              disabled: row.source === 0,
              type: 'primary',
              link: true,
            },
            {
              icon: 'ant-design:delete-twotone',
              type: 'danger',
              link: true,
            },
          ]"
        />
      </template>
      <template #sslExpireDays="{ row }">
        <ElTag v-if="row.sslExpireDays > 0" type="success">
          {{ row.sslExpireDays }}
        </ElTag>
        <ElTag v-else-if="row.sslExpireDays === 0" type="warning"> 0 </ElTag>
      </template>
    </Grid>
    <BaseAddressModal @success="gridApi.query()" />
  </Modal>
</template>

<style scoped></style>
