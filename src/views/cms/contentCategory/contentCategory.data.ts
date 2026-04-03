import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import dayjs from 'dayjs';

import { useRequestHandle } from '#/api/cms/contentCategory';
import { useDict } from '#/utils/dictUtils';

const { status, cmsCategoryType } = useDict('status', 'cmsCategoryType');

export interface RowType {
  date: string;
  menuId: number;
  name: string;
  parentId: null | number;
  size: number;
  type: string;
}
export const searchFormOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单名称',
      },
      fieldName: 'categoryName',
      label: '菜单名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择',
        options: cmsCategoryType,
      },
      fieldName: 'type',
      label: '类型',
    },
  ],
};
const columns: VxeGridPropTypes.Columns<RowType> = [
  { type: 'checkbox', width: 50 },
  { field: 'categoryName', title: '分类名称', treeNode: true },
  { field: 'description', title: '描述' },
  { field: 'icon', width: 50, title: '图标', cellRender: { name: 'Icon' } },
  {
    field: 'type',
    title: '类型',
    width: 50,
    cellRender: { name: 'Dict', props: { dict: 'cmsCategoryType' } },
  },

  {
    field: 'createAt',
    title: '创建时间',
    width: 200,
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY年MM月DD日') : null;
    },
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];
/**
 * Configuration options for the grid component.
 * @template RowType - The type of data rows in the grid.
 * @type {VxeGridProps<RowType>}
 */
export const gridOptions: VxeGridProps.VxeGridProps<RowType> = {
  columns,
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      query: ({ page }, formValues) => {
        return useRequestHandle.tree(formValues);
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
};

export const formSchema: VbenFormSchema[] = [
  {
    label: 'categoryId',
    fieldName: 'categoryId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },

  {
    component: 'ApiTreeSelect',
    fieldName: 'parentId',
    label: '上级分类',
    rules: 'required',
    defaultValue: '0',
    componentProps: {
      placeholder: '请选择',
      // 从后端获取菜单信息
      api: async () => {
        const parentData = [];
        const dept = {
          menuId: '0',
          categoryName: '根节点',
          children: [] as any[],
        };
        dept.children = await useRequestHandle.tree();
        parentData.push(dept);
        return parentData;
      },
      childrenField: 'children',
      // 菜单接口转options格式
      labelField: 'categoryName',
      valueField: 'categoryId',
    },
  },
  {
    component: 'Input',
    fieldName: 'categoryName',
    label: '分类名称',
    rules: 'required',
  },
  {
    fieldName: 'description',
    label: '描述信息',
    component: 'Input',
    componentProps: {
      placeholder: '请输入描述',
    },
  },
  {
    fieldName: 'icon',
    label: '菜单图标',
    component: 'IconPicker',
    componentProps: {
      placeholder: '等待实现',
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: status,
    },
  },

  {
    fieldName: 'sortValue',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 1,
    componentProps: {
      placeholder: '请输入排序值',
    },
  },
  {
    fieldName: 'type',
    label: '类型',
    component: 'RadioGroup',
    defaultValue: 0,
    componentProps: {
      options: cmsCategoryType,
    },
  },
];
