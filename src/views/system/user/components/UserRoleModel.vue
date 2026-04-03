<script lang="ts" setup>
import type { SysUserRow } from '../user.data';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { ElMessage, ElMessageBox } from 'element-plus';

import { addUserRole, deleteUserRole } from '#/api/core/user';
import UserSelector from '#/components/business/UserSelector.vue';

import { useGridOptions } from '../user.data';

defineOptions({
  name: 'UserRoleModel',
});

const userSelector = ref<InstanceType<typeof UserSelector>>();

const roleId = ref<string>('');
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions('role', { roleId: '' }),
  //  formOptions,
  showSearchForm: true,
});
const [Modal, modalApi] = useVbenModal({
  class: 'w-[60%] h-[90%] ',
  async onOpenChange(isOpen) {
    if (isOpen) {
      roleId.value = modalApi.getData().roleId;
      gridApi.setGridOptions(useGridOptions('role', { roleId: roleId.value }));
    }
  },
  onConfirm() {
    modalApi.close();
  },
});

// 删除角色用户
const handleDeleteUserRole = (row: SysUserRow) => {
  ElMessageBox.confirm(`确认要取消关联吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteUserRole({
        roleId: roleId.value,
        userId: row.userId,
      });
      ElMessage.success('取消成功');
      gridApi.reload();
    } catch {
      ElMessage.error('取消失败');
    }
  });
};
const handleSelectUser = () => {
  userSelector.value?.open({ type: 'role', id: roleId.value });
};

const addRuleUser = async (userList: any[]) => {
  try {
    const userIds = userList.map((item) => item.userId);
    await addUserRole({
      roleId: roleId.value,
      userIds,
    });
    await gridApi.reload();
  } catch (error) {
    console.error('添加角色用户失败:', error);
  }
};
</script>

<template>
  <Modal>
    <Page auto-content-height>
      <Grid table-title="用户列表">
        <template #toolbar-actions>
          <el-button type="primary" @click="handleSelectUser">
            已有用户
          </el-button>
        </template>
        <template #action="{ row }">
          <el-button link type="primary" @click="handleDeleteUserRole(row)">
            取消关联
          </el-button>
        </template>
      </Grid>
    </Page>
    <UserSelector
      ref="userSelector"
      multiple
      @update:model-value="addRuleUser"
    />
  </Modal>
</template>

<style lang="scss" scoped></style>
