<script lang="ts" setup>
import { useVbenDrawer } from '@vben/common-ui';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/cms/contentCategory';

import { gridOptions, searchFormOptions } from './contentCategory.data';
import MenuDrawer from './MenuDrawer.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions,
  showSearchForm: true,
});

const expandAll = () => {
  gridApi.grid?.setAllTreeExpand(true);
};

const collapseAll = () => {
  gridApi.grid?.setAllTreeExpand(false);
};
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: MenuDrawer,
});
function openHandle(row: any, type: 'add' | 'edit') {
  drawerApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  drawerApi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.categoryId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.categoryId, gridApi.reload);
}
const reloadTable = () => {
  gridApi.setLoading(true);
  try {
    gridApi.reload({});
  } finally {
    gridApi.setLoading(false);
  }
};
</script>

<template>
  <div class="vp-raw h-[300px] w-full p-5">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-1" type="primary" @click="openHandle(null, 'add')">
          新增
        </ElButton>
        <ElButton class="mr-1" type="primary" @click="expandAll">
          展开全部
        </ElButton>
        <ElButton type="primary" @click="collapseAll"> 折叠全部 </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          text
          type="primary"
          @click="openHandle({ parentId: row.categoryId }, 'add')"
        >
          新增
        </ElButton>
        <ElButton text type="primary" @click="openHandle(row, 'edit')">
          编辑
        </ElButton>
        <ElButton text type="danger" @click="deleteHandle(row)">
          删除
        </ElButton>
      </template>
    </Grid>
    <Drawer @success="reloadTable" />
  </div>
</template>
