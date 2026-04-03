# Pagination 分页组件

### 组件介绍

`Pagination` 是一个基于 Element Plus 的分页组件，提供了灵活的分页功能和页码大小控制。它可以帮助用户轻松实现数据的分页展示。

### 属性

| 属性名 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| current | Number | 1 | 当前页码 |
| size | Number | 10 | 每页显示条目个数 |
| total | Number | 0 | 总条目数 |
| pageSizes | Array<number> | [1, 10, 20, 50, 100, 200] | 每页显示个数选择器的选项列表 |
| layout | String | 'total, sizes, prev, pager, next, jumper' | 组件布局，子组件名用逗号分隔 |

### 事件

| 事件名        | 参数              | 说明                       |
| ------------- | ----------------- | -------------------------- |
| sizeChange    | (size: number)    | 每页显示条目个数改变时触发 |
| currentChange | (current: number) | 当前页码改变时触发         |

### 使用示例

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
  console.log('每页条数改变：', size);
};

const handleCurrentChange = (current: number) => {
  console.log('当前页改变：', current);
};
</script>
```
