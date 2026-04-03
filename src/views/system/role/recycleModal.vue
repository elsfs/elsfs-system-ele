<script setup lang="ts">
import type { SysRole } from '#/api/system/sysRole';

import { defineEmits, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';
import { ArchiveRestore, X } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/system/sysRole';

import { useGridOptions } from './role.data';

const emit = defineEmits<{
  success: [];
}>();
const getCheckboxRecords = ref<SysRole[]>([]);
function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: SysRole[];
}) {
  // 选全部
  getCheckboxRecords.value = checked ? records : [];
}
const [BaseModal, seifModalApi] = useVbenModal({
  async onConfirm() {
    seifModalApi.close();
  },
  confirmText: '关闭',
  showCancelButton: false,
  // 显示关闭按钮
  closable: true,
  class: 'w-[80%]',
  onClosed() {
    emit('success');
  },
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: useGridOptions(true),
  //  formOptions,
  showSearchForm: true,
  gridEvents: {
    checkboxAll,
    checkboxChange: ({ records }: { records: SysRole[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

function restoreHandle(row: SysRole | SysRole[]) {
  if (isArray(row)) {
    useRequestHandle.logicAdd(
      row.map((s) => s.roleId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.logicAdd(row.roleId, gridApi.reload);
}
function logicDelHandle(row: SysRole | SysRole[]) {
  if (isArray(row)) {
    useRequestHandle.logicDel(
      row.map((s) => s.roleId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.logicDel(row.roleId, gridApi.reload);
}
</script>

<template>
  <BaseModal>
    <Page auto-content-height>
      <Grid table-title="角色列表">
        <template #toolbar-actions>
          <el-button
            type="primary"
            @click="restoreHandle(getCheckboxRecords)"
            :disabled="getCheckboxRecords.length === 0"
          >
            <ArchiveRestore />
            批量恢复
          </el-button>
          <el-button
            type="danger"
            @click="logicDelHandle(getCheckboxRecords)"
            :disabled="getCheckboxRecords.length === 0"
          >
            <X />
            批量彻底删除
          </el-button>
        </template>
        <template #action="{ row }">
          <el-button type="primary" @click="restoreHandle(row)">
            恢复
          </el-button>
          <el-button type="danger" @click="logicDelHandle(row)">
            彻底删除
          </el-button>
        </template>
      </Grid>
    </Page>
  </BaseModal>
</template>

<style scoped></style>
