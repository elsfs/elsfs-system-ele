<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import { gridOptions } from './carousel.data';
import CarouselModel from './CarouselModel.vue';

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: CarouselModel,
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  showSearchForm: true,
});
function openModal() {
  modalApi.setData({
    content: '外部传递的数据 content',
    payload: '外部传递的数据 payload',
  });
  modalApi.open();
}
</script>
<template>
  <div class="vp-raw h-[300px] w-full p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton size="small" type="primary" @click="openModal">
          新增
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton size="small" type="primary" @click="openModal(row)">
          编辑
        </ElButton>
      </template>
    </Grid>
    <Modal />
  </div>
</template>
