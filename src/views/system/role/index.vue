<script lang="ts" setup>
import type { SysRole } from '#/api/system/sysRole';

import { ref } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Delete, Plus } from '@element-plus/icons-vue';
import { Recycle } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestRole } from '#/api/core/api';

import UserRoleModel from '../user/components/UserRoleModel.vue';
import RecycleModal from './recycleModal.vue';
import { searchFormOptions, useGridOptions } from './role.data';
import RoleMenuDrawer from './RoleMenuDrawer.vue';
import RoleModal from './RoleModal.vue';

const { useRequestHandle } = useRequestRole;
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions(false, () => (selectedRows.value = [])),
  formOptions: searchFormOptions,
  showSearchForm: true,
  refreshOptions: {
    immediate: true,
  },
  gridEvents: {
    checkboxAll: ({
      checked,
      records,
    }: {
      checked: boolean;
      records: SysRole[];
    }) => {
      // 选全部
      selectedRows.value = checked ? records : [];
    },
    checkboxChange: ({ records }: { records: SysRole[] }) => {
      // 选择
      selectedRows.value = records;
    },
  },
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RoleModal,
});
const [BaseRecycleModal, recycleModalAPi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: RecycleModal,
  destroyOnClose: true, // 在关闭时销毁弹窗
});
function openRecycleModal() {
  recycleModalAPi.open();
}
const [BaseUserRoleModel, baseUserRoleModelApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: UserRoleModel,
});
// 角色管理用户列表弹窗

function roleUserModel(row: SysRole) {
  baseUserRoleModelApi.setData({
    isUpdate: false,
    data: row,
    roleId: row.roleId,
  });
  baseUserRoleModelApi.open();
}

// 新增角色
const handleAdd = () => {
  modalApi.setData({
    isUpdate: false,
    data: null,
  });
  modalApi.open();
};

// 编辑角色
const handleEdit = (row: SysRole) => {
  modalApi.setData({
    isUpdate: true,
    data: row,
  });
  modalApi.open();
};

/**
 * 批量删除or删除角色
 * @param row 待删除的角色
 * @param batch 是否删除
 */
async function handleDelete(row: null | SysRole, batch: false) {
  if (!batch && row) {
    await useRequestHandle.del(row.roleId, gridApi.reload);
  }
  if (batch && selectedRows.value.length > 0) {
    await useRequestHandle.del(
      selectedRows.value.map((s) => s.roleId),
      gridApi.reload,
    );
  }
}

// 导入处理
const [BaseRoleMenuDrawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: RoleMenuDrawer,
});
function open(roleId: string) {
  if (roleId) {
    drawerApi.setData({
      isUpdate: false,
      roleId,
    });
  }
  drawerApi.open();
}
const selectedRows = ref([]);
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>新增角色
        </el-button>
        <el-button
          :disabled="selectedRows.length === 0"
          type="danger"
          @click="handleDelete(null, true)"
        >
          <el-icon><Delete /></el-icon>批量删除
          <span v-if="selectedRows.length > 0" class="selected-count">
            ({{ selectedRows.length }})
          </span>
        </el-button>
        <el-button type="success" @click="openRecycleModal()">
          <Recycle :size="18" />
          回收站
        </el-button>
      </template>
      <template #action="{ row }">
        <el-button link type="primary" @click="roleUserModel(row)">
          用户
        </el-button>
        <el-button link type="success" @click="handleEdit(row)">
          修改
        </el-button>
        <el-button link type="danger" @click="handleDelete(row)">
          删除
        </el-button>
        <el-button link type="warning" @click="open(row.roleId)">
          授权
        </el-button>
      </template>
    </Grid>
    <!-- 编辑角色   -->
    <Modal @success="gridApi.reload()" />
    <BaseRecycleModal @success="gridApi.query()" />
    <!-- 角色用户   -->
    <BaseUserRoleModel @success="gridApi.query()" />
    <BaseRoleMenuDrawer />
  </Page>
</template>

<style lang="scss" scoped>
.vp-raw {
  padding: 20px;

  .selected-count {
    margin-left: 4px;
    font-size: 14px;
  }
}
</style>
