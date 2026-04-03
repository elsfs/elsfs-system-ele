<script setup lang="ts">
import type { TableInstance } from 'element-plus';

import type { BasicTableProps } from '#/hooks/table';

import { computed, reactive, ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Fold } from '@element-plus/icons-vue';
import { Vue3TreeOrg } from 'vue3-tree-org';

import { useRequestDept } from '#/api/core/api';
import RightToolbar from '#/components/RightToolbar/index.vue';
import SearchForm from '#/components/search/SearchForm.vue';
import { useMessage } from '#/hooks/message';
import { useTable } from '#/hooks/table';
import other from '#/utils/other';

import { searchConfig } from './dept.data';
import DeptMenuDrawer from './DeptMenuDrawer.vue';
import DeptModal from './DeptModal.vue';

defineOptions({ name: 'SystemDept' });
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: DeptModal,
});
const { useRequestHandle, requestPath } = useRequestDept;
//  表格ref
const tableRef = ref<TableInstance>();
// 是否显示搜索框
const showSearch = ref(true);
// 展开折叠
const isExpand = ref(true);
// 切换显示 true 图形 false 表格
const switchShow = ref(true);
// tree树右击菜单
const defineMenus: { command: string; name: string }[] = [
  { name: '新建', command: 'addDept' },
  { name: '编辑', command: 'editDept' },
  { name: '删除', command: 'deleteDept' },
];
// 表格设置
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: useRequestHandle.tree,
  queryForm: {
    deptName: '',
  },
  isPage: false,
  descs: ['createAt'],
});

const { getDataList, tableStyle } = useTable(state);
// 导入处理
const [Drawer, drawerApi] = useVbenDrawer({
  // 连接抽离的组件
  connectedComponent: DeptMenuDrawer,
});

/**
 * 打开菜部门单权限
 * @param deptId
 */
function openDeptMenuDrawer(deptId: string) {
  if (deptId) {
    drawerApi.setData({
      isUpdate: false,
      deptId,
    });
  }
  drawerApi.open();
}
/**
 * 切换展开折叠
 * @param children
 * @param unfold
 */
const toggleExpand = (children: any[], unfold = true) => {
  for (const key in children) {
    tableRef.value?.toggleRowExpansion(children[key], unfold);
    if (children[key].children) {
      toggleExpand(children[key].children!, unfold);
    }
  }
};
// 计算树形结构
const treeData = computed(() => {
  if (switchShow.value) {
    return {
      deptId: '0',
      deptName: '租户名字', // todo 获取租户名字
      children: state.dataList,
    };
  }
  return state.dataList;
});

// 展开折叠树
const handleExpand = async () => {
  isExpand.value = !isExpand.value;
  if (switchShow.value) {
    return;
  }
  toggleExpand(state.dataList, isExpand.value);
};

// 导出excel
const exportExcel = () => {
  other.downBlobFile(requestPath.exportPath, state.queryForm, 'dept.xlsx');
};
/**
 * 新增编辑
 * @param id
 * @param command
 */
const openFrom = (id: string, command: string) => {
  onMenus({ node: { id }, command });
};

// 删除当前行
function handleDelete(row: any) {
  try {
    if (row.children && row.children.length > 0) {
      useMessage().error('请先删除子部门');
      return;
    }
    useRequestHandle.del(row.id, () => getDataList());
  } catch (error: any) {
    useMessage().error(error.msg);
  }
}

// 搜索处理
const handleSearch = (formData: Record<string, any>) => {
  state.queryForm = formData;
  getDataList();
};

function onMenus({ node, command }) {
  switch (command) {
    case 'addDept': {
      modalApi.setData({
        isUpdate: false,
        deptId: null,
      });
      modalApi.open();
      break;
    }
    case 'deleteDept': {
      handleDelete(node);
      break;
    }
    case 'editDept': {
      modalApi.setData({
        isUpdate: true,
        deptId: node.id,
      });
      modalApi.open();
      break;
    }
    // No default
  }
}
</script>
<template>
  <div class="layout-padding p-5">
    <div class="layout-padding-auto layout-padding-view">
      <!-- 搜索区域 -->
      <SearchForm
        :col-count="3"
        :default-show-count="3"
        :search-config="searchConfig"
        @search="handleSearch"
      />
      <el-row class="tool-foot">
        <div>
          <div>
            <el-button
              v-if="!switchShow"
              class="ml10"
              icon="folder-add"
              type="primary"
              @click="openFrom(null, 'addDept')"
            >
              添加
            </el-button>
            <el-button @click="handleExpand"> 展开/折叠</el-button>
          </div>
          <RightToolbar
            v-model:show-search="showSearch"
            :export="true"
            class="ml10"
            style="float: right; margin-right: 20px"
            @export-excel="exportExcel"
            @query-table="getDataList"
          >
            <el-tooltip
              class="item"
              content="切换显示"
              effect="dark"
              placement="top"
            >
              <el-button circle @click="switchShow = !switchShow">
                <Fold style="width: 1em; height: 1em; margin: 8px" />
              </el-button>
            </el-tooltip>
          </RightToolbar>
        </div>
      </el-row>
      <el-table
        v-if="!switchShow"
        ref="tableRef"
        :cell-style="tableStyle.cellStyle"
        :data="state.dataList"
        :header-cell-style="tableStyle?.headerCellStyle"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        default-expand-all
        row-key="id"
        style="width: 100%"
        v-loading="state.loading"
      >
        <el-table-column
          label="部门名称"
          prop="deptName"
          show-overflow-tooltip
          width="250"
        />
        <el-table-column
          label="部门编码"
          prop="orgCode"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          label="部门描述"
          prop="deptDesc"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          label="部门类型"
          prop="orgCategory"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          label="状态"
          prop="status"
          show-overflow-tooltip
          width="100"
        >
          <template #default="{ row }">
            <el-tag>{{ row.status === '0' ? '启用' : '禁用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="排序"
          prop="orderNo"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          label="创建时间"
          prop="createAt"
          show-overflow-tooltip
        />
        <el-table-column label="操作" show-overflow-tooltip width="250">
          <template #default="scope">
            <el-button
              link
              type="primary"
              @click="openFrom(scope.row?.id, 'addDept')"
            >
              添加
            </el-button>
            <el-button
              link
              type="primary"
              @click="openFrom(scope.row?.deptId, 'editDept')"
            >
              修改
            </el-button>
            <el-button
              link
              type="warning"
              @click="openDeptMenuDrawer(scope.row?.deptId)"
            >
              授权
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 500px">
        <Vue3TreeOrg
          :collapsable="isExpand"
          :data="treeData"
          :default-expand-level="3"
          :define-menus="defineMenus"
          :label-style="{
            background: '#108ffe',
            color: '#fff',
          }"
          :only-one-node="false"
          :props="{
            id: 'deptId',
            pid: 'parentId',
            label: 'deptName',
            children: 'children',
          }"
          :scalable="false"
          :tool-bar="false"
          center
          @on-contextmenu="onMenus"
        />
      </div>
    </div>

    <Modal @refresh="getDataList()" />
    <Drawer />
  </div>
</template>
<style scoped>
.layout-padding {
  padding: 1px;
}

.tool-foot {
  display: inline;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background-color: var(--el-bg-color);
  border-radius: 4px;

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
