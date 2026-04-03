import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormSchema } from '#/adapter/form';

import { useRequestHandle } from '#/api/cms/contentCategory';

export const gridOptionsContentCategory: VxeTableGridOptions = {
  // 启用选中功能
  radioConfig: {
    highlight: true,
    checkRowKey: 'categoryId',
  },
  rowConfig: {
    /**
     * 当鼠标点击行时，是否要高亮当前行
     */
    isCurrent: true,
    keyField: 'categoryId',
  },
  // 启用列选中功能
  columnConfig: {
    isCurrent: true,
  },
  columns: [
    {
      field: 'categoryName',
      title: '分类名称',
      treeNode: true,
      slots: { default: 'categoryName' },
    },
  ],
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'categoryId',
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: (_, formValues) => {
        return useRequestHandle.tree(formValues);
      },
    },
  },
  exportConfig: {},
};
export const searchSchemaFrom: VbenFormSchema = [
  {
    component: 'Input',
    /**
     * 在Label后显示一个冒号
     */
    colon: true,
    componentProps: {
      placeholder: '请输入标题',
      clearable: true,
      style: {
        width: '240px',
      },
    },
    labelWidth: 70,
    fieldName: 'title',
    label: '标题',
  },
];
export const columns: VbenFormSchema = [
  {
    field: 'title',
    title: '标题',
  },
  {
    field: 'coverImage',
    title: '封面',
    cellRender: {
      name: 'CellImage',
    },
  },
  {
    field: 'summary',
    title: '摘要',
  },
  {
    field: 'createAt',
    title: '创建时间',
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];
