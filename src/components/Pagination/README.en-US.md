# Pagination Component

### Component Introduction

`Pagination` is a pagination component based on Element Plus, providing flexible pagination functionality and page size control. It helps users easily implement paginated data display.

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| current | Number | 1 | Current page number |
| size | Number | 10 | Number of items per page |
| total | Number | 0 | Total number of items |
| pageSizes | Array<number> | [1, 10, 20, 50, 100, 200] | Options for items per page |
| layout | String | 'total, sizes, prev, pager, next, jumper' | Layout of pagination components, separated by comma |

### Events

| Name          | Parameters        | Description                         |
| ------------- | ----------------- | ----------------------------------- |
| sizeChange    | (size: number)    | Triggered when page size changes    |
| currentChange | (current: number) | Triggered when current page changes |

### Usage Example

```vue
<template>
  <Pagination
    :current="1"
    :size="10"
    :total="100"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
const handleSizeChange = (size: number) => {
  console.log('Page size changed:', size);
};

const handleCurrentChange = (current: number) => {
  console.log('Current page changed:', current);
};
</script>
```
