<!--字典项列表-->
<script setup lang="ts">
import type { PropType } from 'vue';

import type { DictItem } from './dictItem.data';

import type { SysDict } from '#/api/devOps/dict';

import { defineProps } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { Delete, Edit } from '@element-plus/icons-vue';
import { ElButton } from 'element-plus';
import { merge } from 'lodash';

import { useRequestHandle } from '#/api/devOps/dictItem';
import DictItemDrawer from '#/views/devOps/dict/components/DictItemDrawer.vue';

import { columns, searchSchemaFrom } from './dictItem.data';

const props = defineProps({
  dict: {
    type: Object as PropType<SysDict>,
    default: () => {},
  },
});
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    // 控制表单是否显示折叠按钮
    showCollapseButton: true,
    // 是否在字段值改变时提交表单
    submitOnChange: true,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    resetButtonOptions: {
      show: false,
    },
    schema: searchSchemaFrom,
  },
  gridOptions: {
    treeConfig: {
      parentField: 'parentId',
      rowField: 'dictItemId',
    },
    columns,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: (_, formValues) => {
          if (props?.dict?.dictId === null) {
            return Promise.resolve();
          }
          return useRequestHandle.tree(
            merge({}, { dictId: props?.dict?.dictId }, formValues),
          );
        },
      },
    },
    exportConfig: {},
    toolbarConfig: {
      // 是否显示搜索表单控制按钮
      // @ts-ignore 正式环境时有完整的类型声明
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
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
  <div>
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-1" type="primary" @click="openDrawer(null)">
          新增
        </ElButton>
      </template>
      <template #action="{ row }">
        <ElButton type="primary" @click="openDrawer(row)">
          <el-icon>
            <Edit />
          </el-icon>
        </ElButton>
        <ElButton type="danger" @click="deleteRow(row)">
          <el-icon>
            <Delete />
          </el-icon>
        </ElButton>
        <ElButton
          type="danger"
          @click="
            openDrawer({
              parentId: row.dictItemId,
              dictId: row.dictId,
            })
          "
        >
          添加下级
        </ElButton>
      </template>
    </Grid>
    <Drawer @success="gridApi.reload()" />
  </div>
</template>

<style scoped></style>
