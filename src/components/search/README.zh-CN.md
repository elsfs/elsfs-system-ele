# SearchForm 搜索表单组件

## 组件介绍

SearchForm 是一个灵活的搜索表单组件，支持多种输入类型，包括文本输入、下拉选择、日期选择和日期范围选择。组件具有响应式布局，并支持展开/收起功能。

## 属性说明

| 属性名           | 类型    | 默认值 | 说明                               |
| ---------------- | ------- | ------ | ---------------------------------- |
| searchConfig     | array   | -      | 搜索配置项数组，定义搜索表单的结构 |
| colCount         | number  | 3      | 每行显示的列数                     |
| showCollapse     | boolean | true   | 是否显示展开/收起按钮              |
| defaultShowCount | number  | 3      | 默认显示的搜索项数量               |

### searchConfig 配置项说明

| 属性名 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| label | string | 是 | 搜索项标签 |
| prop | string | 是 | 搜索项属性名 |
| type | string | 否 | 搜索项类型，支持 'input'、'select'、'date'、'daterange' |
| placeholder | string | 否 | 占位文本 |
| options | array | 否 | 选择框的选项（仅 type='select' 时有效） |
| width | number/string | 否 | 搜索项宽度 |

## 事件

| 事件名 | 说明               | 回调参数               |
| ------ | ------------------ | ---------------------- |
| search | 点击搜索按钮时触发 | formData: 表单数据对象 |
| reset  | 点击重置按钮时触发 | -                      |

## 使用示例

```vue
<template>
  <SearchForm
    :searchConfig="searchConfig"
    :colCount="3"
    :showCollapse="true"
    :defaultShowCount="3"
    @search="handleSearch"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
const searchConfig = [
  {
    label: '用户名',
    prop: 'username',
    type: 'input',
    placeholder: '请输入用户名',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  {
    label: '创建日期',
    prop: 'createDate',
    type: 'daterange',
  },
];

const handleSearch = (formData) => {
  console.log('搜索数据：', formData);
};

const handleReset = () => {
  console.log('表单已重置');
};
</script>
```
