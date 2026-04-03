<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Search } from '@element-plus/icons-vue';

interface TreeNode {
  deptId: number | string;
  deptName: string;
  children?: TreeNode[];
}

interface Props {
  modelValue: (number | string)[];
  data: TreeNode[];
  props: {
    children: string;
    label: string;
  };
  showCheckbox: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  data: () => [],
  props: () => ({
    label: 'deptName',
    children: 'children',
  }),
  showCheckbox: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: (number | string)[]];
}>();

const dialogVisible = ref(false);
const searchKeyword = ref('');
const treeRef = ref();
const selectedNodes = ref<(number | string)[]>([...props.modelValue]);
const selectedNames = ref('');
const treeOperationVisible = ref(false);

// 搜索过滤
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data[props.props.label].includes(value);
};

// 获取所有节点
const getAllNodes = (data: any[]): any[] => {
  const nodes: any[] = [];
  const traverse = (items: any[]) => {
    items.forEach((item) => {
      nodes.push(item);
      if (item.children?.length) {
        traverse(item.children);
      }
    });
  };
  traverse(data);
  return nodes;
};

// 根据ID查找节点
const findNodeById = (data: any[], deptId: number | string): any => {
  for (const item of data) {
    if (item.deptId === deptId) return item;
    if (item.children) {
      const found = findNodeById(item.children, deptId);
      if (found) return found;
    }
  }
  return null;
};

// 更新选中项的显示名称
const updateSelectedNames = () => {
  const names = selectedNodes.value
    .map((deptId) => {
      const node = findNodeById(props.data, deptId);
      return node ? node[props.props.label] : '';
    })
    .filter(Boolean);
  selectedNames.value = names.join(', ');
};

// 处理选中变化--多选
const handleCheck = (_: any, { checkedKeys }: any) => {
  selectedNodes.value = checkedKeys;
};
// 处理选中变化-- 单选
const singleSelectCheck = (res: TreeNode) => {
  selectedNodes.value = [res.deptId];
};

// 确认选择
const handleConfirm = () => {
  emit('update:modelValue', selectedNodes.value);
  updateSelectedNames();
  dialogVisible.value = false;
  treeOperationVisible.value = false;
};

// 取消选择
const handleCancel = () => {
  selectedNodes.value = [...props.modelValue];
  dialogVisible.value = false;
  treeOperationVisible.value = false;
};

// 树操作功能
const handleSelectAll = () => {
  const allNodes = getAllNodes(props.data);
  treeRef.value?.setCheckedKeys(allNodes.map((node) => node.deptId));
  treeOperationVisible.value = false;
};

const handleDeselectAll = () => {
  treeRef.value?.setCheckedKeys([]);
  treeOperationVisible.value = false;
};

const handleExpandAll = () => {
  const allNodes = getAllNodes(props.data);
  allNodes.forEach((node) => {
    treeRef.value?.store.nodesMap[node.deptId]?.expand();
  });
  treeOperationVisible.value = false;
};

const handleCollapseAll = () => {
  const allNodes = getAllNodes(props.data);
  allNodes.forEach((node) => {
    treeRef.value?.store.nodesMap[node.deptId]?.collapse();
  });
  treeOperationVisible.value = false;
};

// 监听搜索关键字变化
watch(searchKeyword, (val) => {
  treeRef.value?.filter(val);
});

// 初始化时更新选中项的显示名称
watch(
  () => props.modelValue,
  () => {
    selectedNodes.value = [...props.modelValue];
    updateSelectedNames();
  },
  { immediate: true },
);
</script>

<template>
  <!-- 部门选择器根容器 -->
  <div class="dept-selector">
    <!-- 选中部门显示输入框，只读模式 -->
    <el-input
      v-model="selectedNames"
      placeholder="请选择部门"
      readonly
      @click="dialogVisible = true"
    >
      <!-- 输入框后缀按钮 -->
      <template #append>
        <el-button @click="dialogVisible = true">选择</el-button>
      </template>
    </el-input>

    <!-- 部门选择对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :close-on-click-modal="false"
      title="部门选择"
      width="500px"
    >
      <!-- 搜索框区域 -->
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          clearable
          placeholder="请输入关键字搜索"
        >
          <!-- 搜索图标 -->
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 部门树组件 -->
      <el-tree
        ref="treeRef"
        :data="props.data"
        :default-checked-keys="modelValue"
        :filter-node-method="filterNode"
        :props="props.props"
        :show-checkbox="showCheckbox"
        class="dept-tree"
        node-key="deptId"
        @check="handleCheck"
        @node-click="singleSelectCheck"
      />

      <!-- 对话框底部按钮区域 -->
      <template #footer>
        <div class="dialog-footer">
          <!-- 树操作下拉菜单 -->
          <el-popover
            v-model:visible="treeOperationVisible"
            :width="120"
            placement="top"
            trigger="click"
          >
            <!-- 树操作按钮 -->
            <template #reference>
              <el-button>树操作</el-button>
            </template>
            <!-- 树操作选项列表 -->
            <div class="tree-operations">
              <el-button text @click="handleSelectAll">全部勾选</el-button>
              <el-button text @click="handleDeselectAll">取消全选</el-button>
              <el-button text @click="handleExpandAll">展开全部</el-button>
              <el-button text @click="handleCollapseAll">折叠全部</el-button>
            </div>
          </el-popover>
          <!-- 确认取消按钮组 -->
          <div>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleConfirm">确认</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 部门选择器容器样式 */
.dept-selector {
  width: 100%; /* 确保选择器占满容器宽度 */
}

/* 搜索框容器样式 */
.search-box {
  margin-bottom: 15px; /* 与树组件保持间距 */
}

/* 部门树容器样式 */
.dept-tree {
  height: 300px; /* 固定树的高度 */
  overflow-y: auto; /* 内容超出时显示垂直滚动条 */
}

/* 对话框底部样式 */
.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 两端对齐布局 */
}

/* 树操作按钮组样式 */
.tree-operations {
  display: flex;
  flex-direction: column; /* 垂直排列按钮 */
  gap: 4px; /* 按钮间距 */
  padding: 4px 0; /* 上下内边距 */
}
</style>
