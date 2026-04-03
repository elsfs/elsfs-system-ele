import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps } from '@vben-core/form-ui';

import type { VbenFormSchema } from '#/adapter/form';
import type { GenFieldType } from '#/api/developer/genFieldType';

import { merge } from 'lodash';

import { useRequestHandle } from '#/api/developer/genFieldType';

export const formSchema: VbenFormSchema[] = [
  {
    label: 'ID',
    fieldName: 'id',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    component: 'Input',
    fieldName: 'columnType',
    label: '字段类型',
    rules: 'required',
    componentProps: {
      placeholder: '请输入字段类型',
    },
  },
  {
    component: 'Input',
    fieldName: 'attrType',
    label: '属性类型',
    rules: 'required',
    componentProps: {
      placeholder: '请输入属性类型',
    },
  },
  {
    component: 'Input',
    fieldName: 'packageName',
    label: '属性包名',
    componentProps: {
      placeholder: '请输入属性包名',
    },
  },
];

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
        placeholder: '请输入字段类型',
        clearable: true,
      },
      fieldName: 'columnType',
      label: '字段类型',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入属性类型',
        clearable: true,
      },
      fieldName: 'attrType',
      label: '属性类型',
    },
  ],
};

const columns: VxeGridPropTypes.Columns<GenFieldType> = [
  { field: 'columnType', title: '字段类型' },
  { field: 'attrType', title: '属性类型' },
  { field: 'packageName', title: '属性包名' },
  { field: 'createAt', title: '创建时间' },
  {
    field: 'action',
    slots: { default: 'action' },
    title: '操作',
  },
];
export const gridOptions: VxeGridProps.VxeGridProps<GenFieldType> = {
  columns,
  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    enabled: true,
    search: false,
    custom: false,
    export: false,
    // import: true,
    refresh: true,
    zoom: false,
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: async ({ page }, formValues) => {
        return useRequestHandle.page(
          merge(
            {
              current: page.currentPage,
              pages: page.pageSize,
            },
            formValues,
          ),
        );
      },
    },
  },
  exportConfig: {
    // 导出文件名
    filename: '分组列表',
  },
};
