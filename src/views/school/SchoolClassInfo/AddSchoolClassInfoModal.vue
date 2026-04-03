<script setup lang="ts">
import type { SchoolClassInfo } from './SchoolClassInfo.data';

import { reactive } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useMessage } from '#/hooks';
import { useDict } from '#/utils/dictUtils';

defineOptions({
  name: 'AddSchoolClassInfoModal',
});
const { classStatus } = useDict('classStatus');
const basisDate = reactive<SchoolClassInfo>({
  session: dayjs().year().toString(),
  classStatus: '0',
  gradesName: '七年级',
  className: '1班',
  editable: true,
});
const tableData = reactive<SchoolClassInfo[]>([]);

const tableBlurHandler = (row: SchoolClassInfo) => {
  row.name = row.gradesName + row.className;
};
/**
 * 添加表格数据
 */
const addTableHandle = () => {
  const copyDate = cloneDeep(basisDate);
  tableBlurHandler(copyDate);
  tableData.push(copyDate);
};

const message = useMessage();
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
  },
  // 点击确定按钮的回调
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  class: 'w-[60%]',
  // 是否自动聚焦
  openAutoFocus: true,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      // 清空tableData
      tableData.splice(0);
    }
  },
  onOpened() {
    tableData.forEach((s) => {
      if (s.classTeacherName === null) {
        message.errorMessage('姓名为空');
      }
    });
    // todo 添加批量保存的接口
  },
});
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    editConfig: {
      trigger: 'click',
      mode: 'row',
    },
    editRules: {
      gradesName: [{ required: true, content: '年级名称不能为空' }],
      className: [{ required: true, content: '班级名称不能为空' }],
      classTeacherId: [{ required: true, content: '班主任不能为空' }],
      classStatus: [{ required: true, content: '班级状态不能为空' }],
      session: [{ required: true, content: '届次不能为空' }],
    },
    columns: [
      { type: 'checkbox', width: 50 },
      { field: 'name', title: '班级名称' },
      {
        field: 'gradesName',
        title: '年级名称',
        editRules: 'required',
        editRender: {
          name: 'input',
        },
      },
      {
        field: 'className',
        title: '班名称',
        editRender: {
          name: 'input',
        },
      },
      { field: 'session', title: '届次' },
      {
        field: 'classTeacherId',
        title: '班主任',
        formatter: ({ _, row, __ }) => {
          return row.classTeacherName;
        },
        editRender: {
          name: 'select',
          options: [
            { label: '张三', value: '1' },
            { label: '李四', value: '2' },
            { label: '王五', value: '3' },
          ],
        },
      },
      {
        field: 'classStatus',
        title: '班级状态',
        editRender: {
          name: 'select',
          options: classStatus,
        },
      },
      {
        title: '操作',
        fixed: 'right',
        width: 200,
        slots: { default: 'action' },
      },
    ],
    data: tableData,
    pagerConfig: {
      enabled: false,
    },
    sortConfig: {
      multiple: true,
    },
  },
});
</script>

<template>
  <Modal>
    <div>
      <el-form :inline="true" :model="basisDate" class="demo-form-inline">
        <el-form-item label="届次">
          <el-input v-model="basisDate.session" placeholder="请输入届次" />
        </el-form-item>
        <el-form-item label="班级状态">
          <el-select
            v-model="basisDate.classStatus"
            clearable
            placeholder="请选择班级状态"
          >
            <el-option label="未开始" value="0" />
            <el-option label="进行中" value="1" />
            <el-option label="结束" value="-1" />
          </el-select>
        </el-form-item>
        <el-form-item label="年级名称">
          <el-select
            v-model="basisDate.gradesName"
            clearable
            placeholder="请选择年级名称"
          >
            <el-option label="七年级" value="七年级" />
            <el-option label="八年级" value="八年级" />
            <el-option label="九年级" value="九年级" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="addTableHandle">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <Grid>
      <template #action="{ row }">
        <el-button
          size="small"
          @click="tableData.splice(tableData.indexOf(row), 1)"
        >
          删除
        </el-button>
      </template>
    </Grid>
  </Modal>
</template>

<style scoped>
.demo-form-inline .el-input {
  --el-input-width: 100px;
}

.demo-form-inline .el-select {
  --el-select-width: 100px;
}
</style>
