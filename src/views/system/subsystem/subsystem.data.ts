import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { SysSubsystem } from '#/api/system/subsystem';

import { useRequestHandle as useTemplateRequestHandle } from '#/api/system/subsystem';

export const formSchema: VbenFormSchema[] = [
  {
    label: 'ID',
    fieldName: 'subsystemName',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    component: 'Input',
    fieldName: 'subsystemName',
    label: '子系统名称',
    rules: 'required',
    componentProps: {
      placeholder: '请输入子系统名称',
    },
  },
  {
    component: 'Input',
    fieldName: 'subsystemCode',
    label: '子系统编码',
    rules: 'required',
    componentProps: {
      placeholder: '请输入子系统编码',
    },
  },
  {
    component: 'InputNumber',
    fieldName: 'sort',
    label: '排序',
    defaultValue: 0
  },
  {
    component: 'IconPicker',
    fieldName: 'icon',
    label: '图标',
    componentProps: {
      placeholder: '请输入',
    },
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: '状态',
    componentProps: {
      placeholder: '请输入',
      options: [
        {
          label: '启用',
          value: '1',
        },
        {
          label: '禁用',
          value: '0',
        },
      ],
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
      fieldName: 'subsystemName',
      label: '子系统名称',
    },
  ],
};

const columns: VxeGridPropTypes.Columns<SysSubsystem> = [
  { field: 'subsystemName', title: '子系统名称' },
  { field: 'subsystemCode', title: '子系统编码' },
  { field: 'sort', title: '排序' },
  { field: 'status', title: '状态' ,formatter: ({cellValue} ) => {
    return cellValue === 1 ? '启用' : '禁用';
    }},
  { field: 'createAt', title: '创建时间' },
  {
    field: 'action',
    slots: { default: 'action' },
    title: '操作',
  },
];
export const gridOptions: VxeGridProps<SysSubsystem> = {
  columns,
  toolbarConfig: {
    enabled: true,
    custom: false,
    export: false,
    // import: true,
    refresh: true,
    zoom: false,
  },
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: async (_, formValues) => {
        return useTemplateRequestHandle.list(formValues);
      },
    },
  },
  exportConfig: {
    // 导出文件名
    filename: '子系统',
  },
};
