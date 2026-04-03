# SearchForm Component

## Introduction

SearchForm is a flexible search form component that supports various input types, including text input, dropdown selection, date picker, and date range picker. The component features a responsive layout and supports expand/collapse functionality.

## Props

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| searchConfig | array | - | Array of search configuration items |
| colCount | number | 3 | Number of columns per row |
| showCollapse | boolean | true | Whether to show expand/collapse button |
| defaultShowCount | number | 3 | Default number of visible search items |

### searchConfig Item Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| label | string | Yes | Label of the search item |
| prop | string | Yes | Property name of the search item |
| type | string | No | Type of search item ('input', 'select', 'date', 'daterange') |
| placeholder | string | No | Placeholder text |
| options | array | No | Options for select type (only when type='select') |
| width | number/string | No | Width of the search item |

## Events

| Event Name | Description | Callback Parameters |
| --- | --- | --- |
| search | Triggered when search button is clicked | formData: form data object |
| reset | Triggered when reset button is clicked | - |

## Usage Example

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
    label: 'Username',
    prop: 'username',
    type: 'input',
    placeholder: 'Please enter username',
  },
  {
    label: 'Status',
    prop: 'status',
    type: 'select',
    options: [
      { label: 'Enabled', value: 1 },
      { label: 'Disabled', value: 0 },
    ],
  },
  {
    label: 'Create Date',
    prop: 'createDate',
    type: 'daterange',
  },
];

const handleSearch = (formData) => {
  console.log('Search data:', formData);
};

const handleReset = () => {
  console.log('Form reset');
};
</script>
```
