# BasisTable Component

## Introduction

BasisTable is a feature-rich table component that integrates common table functionalities, including data display, pagination, column settings, import/export, and table density adjustment. This component is built on top of Element Plus's Table component, providing a more convenient way to use and additional practical features.

## Props

| Prop Name   | Type          | Default | Description                      |
| ----------- | ------------- | ------- | -------------------------------- |
| columns     | array         | -       | Table column configuration array |
| data        | array         | -       | Table data array                 |
| loading     | boolean       | false   | Table loading state              |
| height      | string/number | -       | Table height                     |
| showToolbar | boolean       | true    | Whether to show the toolbar      |
| pagination  | object        | -       | Pagination configuration         |

### columns Configuration

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| prop | string | Yes | Column property name |
| label | string | Yes | Column label |
| width | number/string | No | Column width |
| minWidth | number/string | No | Minimum column width |
| align | string | No | Text alignment ('left'/'center'/'right') |
| fixed | string/boolean | No | Fixed column position ('left'/'right') |
| type | string | No | Column type, supports 'selection' for multi-select |
| slot | string | No | Custom column slot name |

### pagination Configuration

| Property | Type   | Description           |
| -------- | ------ | --------------------- |
| current  | number | Current page number   |
| pageSize | number | Items per page        |
| total    | number | Total number of items |

## Events

| Event Name | Description | Callback Parameters |
| --- | --- | --- |
| change | Triggered when pagination changes | (page: number, pageSize: number) |
| selectionChange | Triggered when selection changes | (selection: array) |
| import | Triggered when data is imported | (data: array) |
| refresh | Triggered when refresh button is clicked | - |

## Slots

| Slot Name     | Description           | Scope Parameters |
| ------------- | --------------------- | ---------------- |
| toolbar-left  | Toolbar left content  | -                |
| toolbar-right | Toolbar right content | -                |
| [column.slot] | Custom column content | { row, index }   |

## Features

1. **Toolbar Features**
   - Data import/export
   - Table refresh
   - Density adjustment (loose/default/compact)
   - Column display settings

2. **Table Features**
   - Multi-selection
   - Custom column content
   - Column width adjustment
   - Fixed columns

3. **Pagination Features**
   - Page navigation
   - Page size adjustment
   - Total count display

## Usage Example

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
    <!-- Custom toolbar -->
    <template #toolbar-left>
      <el-button type="primary">Add</el-button>
    </template>

    <!-- Custom column content -->
    <template #operation="{ row }">
      <el-button link @click="handleEdit(row)">Edit</el-button>
      <el-button link @click="handleDelete(row)">Delete</el-button>
    </template>
  </BasisTable>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Column configuration
const columns = [
  { type: 'selection' },
  { prop: 'name', label: 'Name' },
  { prop: 'age', label: 'Age' },
  { prop: 'address', label: 'Address' },
  {
    prop: 'operation',
    label: 'Actions',
    slot: 'operation',
    fixed: 'right',
    width: 150,
  },
];

// Table data
const tableData = ref([
  { name: 'John Doe', age: 18, address: 'New York' },
  { name: 'Jane Smith', age: 20, address: 'Los Angeles' },
]);

// Pagination configuration
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 100,
});

// Loading state
const loading = ref(false);

// Page change handler
const handlePageChange = (page: number, pageSize: number) => {
  pagination.value.current = page;
  pagination.value.pageSize = pageSize;
  // Load new data
};

// Selection change handler
const handleSelectionChange = (selection: any[]) => {
  console.log('Selected data:', selection);
};

// Import data handler
const handleDataImport = (data: any[]) => {
  console.log('Imported data:', data);
};

// Refresh handler
const handleRefresh = () => {
  // Reload data
};
</script>
```
