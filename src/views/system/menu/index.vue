<script lang="ts" setup>
import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { ElButton } from 'element-plus';
import { isArray } from 'lodash';
import { CirclePlus, Expand, FoldHorizontal } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { MenuType, useRequestHandle } from '#/api/system/menu';

import { gridOptions, searchFormOptions } from './menu.data';
import MenuDrawer from './MenuDrawer.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions,
  showSearchForm: true,
});

const isExpandAll = ref(false);
const expandAll = () => {
  isExpandAll.value = true;
  gridApi.grid?.setAllTreeExpand(isExpandAll.value);
};

const collapseAll = () => {
  isExpandAll.value = false;
  gridApi.grid?.setAllTreeExpand(isExpandAll.value);
};
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: MenuDrawer,
});
function openHandle(row: any, type: 'add' | 'edit', menuType?: MenuType) {
  drawerApi.setData({
    isUpdate: type === 'edit',
    data: row,
    menuType,
  });
  drawerApi.open();
}
function deleteHandle(row: any | any[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.menuId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.menuId, gridApi.reload);
}
</script>

<template>
  <Page auto-content-height>
    <Drawer @success="gridApi.reload()" />
    <Grid table-title="菜单列表">
      <template #toolbar-actions>
        <ElButton
          type="primary"
          @click="openHandle(null, 'add', MenuType.CATALOG)"
        >
          <CirclePlus :size="18" />
          新增
        </ElButton>
        <ElButton link :disabled="isExpandAll" @click="expandAll">
          <Expand :size="18" />
          展开全部
        </ElButton>
        <ElButton link :disabled="!isExpandAll" @click="collapseAll">
          <FoldHorizontal :size="18" />
          折叠全部
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton
          text
          type="primary"
          @click="
            openHandle(
              { parentId: row.menuId },
              'add',
              row.type === MenuType.BUTTON ? MenuType.BUTTON : MenuType.MENU,
            )
          "
        >
          新增
        </ElButton>
        <ElButton text type="primary" @click="openHandle(row, 'edit', null)">
          编辑
        </ElButton>
        <ElButton text type="danger" @click="deleteHandle(row)">
          删除
        </ElButton>
      </template>
      <template #menuName="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              :icon="row?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ row.menuName }}</span>
          <div class="items-center justify-end"></div>
        </div>
      </template>
    </Grid>
  </Page>
</template>
