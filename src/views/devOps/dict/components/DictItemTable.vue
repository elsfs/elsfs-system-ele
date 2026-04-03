<script setup lang="ts">
import type { PropType } from 'vue';

import type { DictItem } from './dictItem.data';

import type { SysDict } from '#/api/devOps/dict';

import { defineProps } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Edit } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import { merge } from 'lodash';

import { useRequestHandle } from '#/api/devOps/dictItem';

import { gridOptions, searchFormOptions } from './dictItem.data';
import DictItemDrawer from './DictItemDrawer.vue';

const props = defineProps({
  dict: {
    type: Object as PropType<SysDict>,
    default: () => {},
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    ...gridOptions,
    proxyConfig: {
      enabled: true,
      ajax: {
        query: ({ page }, formValues) => {
          if (props.dict.dictId === null) {
            return Promise.resolve();
          }
          const parameter = {
            current: page.currentPage,
            pages: page.pageSize,
            dictId: props.dict.dictId,
          };
          return useRequestHandle.page(merge(parameter, formValues));
        },
      },
    },
  },
  showSearchForm: true,
});
const [Drawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: DictItemDrawer,
});

function openDrawer(row: DictItem) {
  formDrawerApi.setData({
    dictItem: row,
    dict: props.dict,
    isUpdate: !!row?.dictItemId,
  });
  formDrawerApi.open();
}
async function deleteRow(row: DictItem) {
  useRequestHandle.del(row.dictItemId, gridApi.reload);
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-1" type="primary" @click="openDrawer(null)">
          新增
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton text type="primary" @click="openDrawer(row)">
          <el-icon>
            <Edit />
          </el-icon>
        </ElButton>
        <ElButton text type="danger" @click="deleteRow(row)"> 删除 </ElButton>
      </template>
    </Grid>
    <Drawer @success="gridApi.reload()" />
  </div>
</template>

<style scoped></style>
