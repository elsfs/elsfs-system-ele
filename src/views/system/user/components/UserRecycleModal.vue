<script setup lang="ts">
import type { SysUser } from '#/api/system/user';

import { defineEmits, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { isArray } from 'lodash';
import { ArchiveRestore, X } from 'lucide-vue-next';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useRequestHandle } from '#/api/system/user';

import { searchFormOptions as formOptions, useGridOptions } from '../user.data';

defineOptions({
  name: 'UserRecycleModal',
});
const emit = defineEmits<{
  success: [];
}>();
const getCheckboxRecords = ref<SysUser[]>([]);
function checkboxAll({
  checked,
  records,
}: {
  checked: boolean;
  records: SysUser[];
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
  gridOptions: useGridOptions('recycle'),
  formOptions,
  showSearchForm: true,
  gridEvents: {
    checkboxAll,
    checkboxChange: ({ records }: { records: SysUser[] }) => {
      // 选择
      getCheckboxRecords.value = records;
    },
  },
});

function restoreHandle(row: SysUser | SysUser[]) {
  if (isArray(row)) {
    useRequestHandle.logicAdd(
      row.map((s) => s.userId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.logicAdd(row.userId, gridApi.reload);
}
function logicDelHandle(row: SysUser | SysUser[]) {
  if (isArray(row)) {
    useRequestHandle.logicDel(
      row.map((s) => s.userId),
      gridApi.reload,
    );
    return;
  }
  useRequestHandle.logicDel(row.userId, gridApi.reload);
}
</script>

<template>
  <BaseModal>
    <Page auto-content-height>
      <Grid table-title="职位列表">
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
