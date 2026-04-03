<script lang="ts" setup>
import type { SysUser } from '#/api/system/user';

import { computed } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';
import { CirclePlus, Recycle } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { configItem } from '#/api/devOps/sysConfig';
import { useRequestHandle } from '#/api/system/user';
import { useConfigStore } from '#/store';

import UserMenuDrawer from './components/UserMenuDrawer.vue';
import RecycleModal from './components/UserRecycleModal.vue';
// 组件引入
import SysUserModal from './SysUserModal.vue';
import { searchFormOptions as formOptions, useGridOptions } from './user.data';

const useConfig = useConfigStore();
useConfig.preloadConfig([
  configItem.ENABLE_USER_MULTIPLE_DEPT,
  configItem.ENABLE_USER_MENU,
  configItem.ENABLE_USER_MULTIPLE_POST,
]);
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions('normal'),
  formOptions,
  showSearchForm: true,
});
const [BaseRecycleModal, recycleModalAPi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RecycleModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});
// 导入处理
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: UserMenuDrawer,
});

/**
 * 打开菜用户菜单权限
 * @param userId
 */
function openUserMenuDrawer(userId: string) {
  if (userId) {
    drawerApi.setData({
      isUpdate: false,
      userId,
    });
  }
  drawerApi.open();
}
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: SysUserModal,
});

// 刷新处理
const reloadTable = () => {
  gridApi.setLoading(true);
  try {
    gridApi.reload({});
  } finally {
    gridApi.setLoading(false);
  }
};

function deleteHandle(row: SysUser | SysUser[]) {
  if (isArray(row)) {
    useRequestHandle.del(
      row.map((s) => s.userId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.del(row.userId, gridApi.reload);
}

const idOpen = computed(() => {
  return useConfig.getConfigToBoolean(configItem.ENABLE_USER_MENU);
});
function openRecycleModal() {
  recycleModalAPi.open();
}

function openModal(row: any, type: 'add' | 'edit') {
  modalApi.setData({
    isUpdate: type === 'edit',
    data: row,
  });
  modalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="用户列表">
      <template #toolbar-actions>
        <el-button type="primary" @click="openModal(null, 'add')">
          <CirclePlus :size="18" />新增用户
        </el-button>
        <el-button type="success" @click="openRecycleModal()">
          <Recycle :size="18" />
          回收站
        </el-button>
      </template>
      <!-- 操作列 -->
      <template #action="{ row }">
        <el-button link type="primary" @click="openModal(row, 'edit')">
          编辑
        </el-button>
        <el-button
          link
          type="warning"
          v-if="idOpen"
          @click="openUserMenuDrawer(row?.userId)"
        >
          授权
        </el-button>
        <el-button link type="danger" @click="deleteHandle(row)">
          删除
        </el-button>
      </template>
    </Grid>
    <Modal @success="reloadTable" />
    <Drawer />
    <BaseRecycleModal @success="gridApi.query()" />
  </Page>
</template>

<style lang="scss" scoped></style>
