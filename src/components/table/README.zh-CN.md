# BasisTable 基础表格组件

## 组件介绍

BasisTable 是一个功能丰富的表格组件，集成了常用的表格功能，包括数据展示、分页、列设置、导入导出、表格密度调整等功能。该组件基于 Element Plus 的 Table 组件进行封装，提供了更便捷的使用方式和更多的实用功能。

## 属性说明

| 属性名      | 类型          | 默认值 | 说明           |
| ----------- | ------------- | ------ | -------------- |
| columns     | array         | -      | 表格列配置数组 |
| data        | array         | -      | 表格数据数组   |
| loading     | boolean       | false  | 表格加载状态   |
| height      | string/number | -      | 表格高度       |
| showToolbar | boolean       | true   | 是否显示工具栏 |
| pagination  | object        | -      | 分页配置       |

### columns 列配置项说明

| 属性名   | 类型           | 必填 | 说明                                |
| -------- | -------------- | ---- | ----------------------------------- |
| prop     | string         | 是   | 列属性名                            |
| label    | string         | 是   | 列标签名                            |
| width    | number/string  | 否   | 列宽度                              |
| minWidth | number/string  | 否   | 最小列宽度                          |
| align    | string         | 否   | 对齐方式（'left'/'center'/'right'） |
| fixed    | string/boolean | 否   | 列固定位置（'left'/'right'）        |
| type     | string         | 否   | 列类型，支持 'selection' 用于多选   |
| slot     | string         | 否   | 自定义列插槽名称                    |

### pagination 分页配置项说明

| 属性名   | 类型   | 说明         |
| -------- | ------ | ------------ |
| current  | number | 当前页码     |
| pageSize | number | 每页显示条数 |
| total    | number | 总条数       |

## 事件

| 事件名          | 说明               | 回调参数                         |
| --------------- | ------------------ | -------------------------------- |
| change          | 分页变化时触发     | (page: number, pageSize: number) |
| selectionChange | 选择项变化时触发   | (selection: array)               |
| import          | 导入数据时触发     | (data: array)                    |
| refresh         | 点击刷新按钮时触发 | -                                |

## 插槽

| 插槽名        | 说明           | 作用域参数     |
| ------------- | -------------- | -------------- |
| toolbar-left  | 工具栏左侧内容 | -              |
| toolbar-right | 工具栏右侧内容 | -              |
| [column.slot] | 自定义列内容   | { row, index } |

## 功能特性

1. **工具栏功能**
   - 数据导入/导出
   - 表格刷新
   - 密度调整（宽松/默认/紧凑）
   - 列显示设置

2. **表格功能**
   - 多选功能
   - 自定义列内容
   - 列宽调整
   - 固定列

3. **分页功能**
   - 页码切换
   - 每页条数调整
   - 总条数显示

## 使用示例

```vue
<template>
  <BasisTable
    :columns="columns"
    :data="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handlePageChange"
    @selectionChange="handleSelectionChange"
    @import="handleDataImport"
    @refresh="handleRefresh"
  >
    <!-- 自定义工具栏 -->
    <template #toolbar-left>
      <el-button type="primary">新增</el-button>
    </template>

    <!-- 自定义列内容 -->
    <template #operation="{ row }">
      <el-button link @click="handleEdit(row)">编辑</el-button>
      <el-button link @click="handleDelete(row)">删除</el-button>
    </template>
  </BasisTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 列配置
const columns = [
  { type: 'selection' },
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'address', label: '地址' },
  {
    prop: 'operation',
    label: '操作',
    slot: 'operation',
    fixed: 'right',
    width: 150,
  },
];

// 表格数据
const tableData = ref([
  { name: '张三', age: 18, address: '北京' },
  { name: '李四', age: 20, address: '上海' },
]);

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
});

// 加载状态
const loading = ref(false);

// 页面变化处理
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page;
  pagination.value.pageSize = pageSize;
  // 加载新数据
};

// 选择变化处理
const handleSelectionChange = (selection: any[]) => {
  console.log('选中的数据：', selection);
};

// 数据导入处理
const handleDataImport = (data: any[]) => {
  console.log('导入的数据：', data);
};

// 刷新处理
const handleRefresh = () => {
  // 重新加载数据
};
</script>
```
