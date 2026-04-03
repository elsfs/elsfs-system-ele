import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { GenTemplate } from '#/api/developer/genTemplate';

import { useRequestHandle as useTemplateRequestHandle } from '#/api/developer/genTemplate';

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
    fieldName: 'templateName',
    label: '模板名称',
    rules: 'required',
    componentProps: {
      placeholder: '请输入模板名称',
    },
  },
  {
    component: 'Input',
    fieldName: 'generatorPath',
    label: '模板路径',
    rules: 'required',
    componentProps: {
      placeholder: '请输入模板路径',
    },
  },
  {
    component: 'Input',
    fieldName: 'templateDesc',
    label: '模板描述',
    componentProps: {
      placeholder: '请输入模板描述',
      type: 'textarea',
    },
  },
  {
    component: 'Input',
    fieldName: 'templateCode',
    label: '模板代码',
    componentProps: {
      placeholder: '请输入模板代码',
      type: 'textarea',
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
      fieldName: 'templateName',
      label: '模板名称',
    },
  ],
};

const columns: VxeGridPropTypes.Columns<GenTemplate> = [
  { field: 'templateName', title: '模板名称' },
  { field: 'generatorPath', title: '模板路径' },
  { field: 'templateDesc', title: '模板描述' },
  { field: 'createAt', title: '创建时间' },
  {
    field: 'action',
    slots: { default: 'action' },
    title: '操作',
  },
];
export const gridOptions: VxeGridProps.VxeGridProps<GenTemplate> = {
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
