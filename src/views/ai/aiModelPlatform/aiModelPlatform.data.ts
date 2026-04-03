import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { AiModelPlatform } from '#/api/ai/aiModelPlatform';

import { useRequestHandle as useTemplateRequestHandle } from '#/api/ai/aiModelPlatform';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');
// 表单
export const formSchema: VbenFormSchema[] = [
  {
    label: '平台id',
    fieldName: 'platformId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },

  {
    label: '平台名称',
    fieldName: 'name',
    component: 'Input',
    rules: 'required',
  },

  {
    label: '平台描述',
    fieldName: 'description',
    component: 'Input',
    componentProps: {
      type: 'textarea',
    },
  },

  {
    label: '平台类型',
    fieldName: 'type',
    component: 'Input',
    rules: 'required',
  },

  {
    label: '地址',
    fieldName: 'baseUrl',
    component: 'Input',
  },

  {
    label: 'apiKey',
    fieldName: 'apiKey',
    component: 'Input',
  },

  {
    label: '状态',
    fieldName: 'status',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: status,
    },
  },
];
// 搜索
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
      label: '平台名称',
      fieldName: 'name',
    },
    {
      component: 'Input',
      label: '平台描述',
      fieldName: 'description',
    },
    {
      component: 'Input',
      label: '平台类型',
      fieldName: 'type',
    },
    {
      component: 'Select',
      label: '状态',
      fieldName: 'status',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: status,
      },
    },
  ],
};

const columns: VxeGridPropTypes.Columns<AiModelPlatform> = [
  { field: 'name', title: '平台名称' },
  { field: 'description', title: '平台描述' },
  { field: 'type', title: '平台类型' },
  { field: 'baseUrl', title: '地址' },
  {
    field: 'action',
    slots: { default: 'action' },
    title: '操作',
  },
];
export const gridOptions: VxeGridProps.VxeGridProps<AiModelPlatform> = {
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
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: async ({ _ }, formValues) => {
        return useTemplateRequestHandle.list(formValues);
      },
    },
  },
  exportConfig: {
    // 导出文件名
    filename: '分组列表',
  },
};
