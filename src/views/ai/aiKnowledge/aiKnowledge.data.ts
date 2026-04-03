import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { AiKnowledge } from '#/api/ai/aiKnowledge';

import { merge } from 'lodash';

import { useRequestHandle } from '#/api/ai/aiKnowledge';
import { useRequestHandle as aiModelPlatformRequestHandle } from '#/api/ai/aiModelConfig';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');

// 表单
export const formSchema: VbenFormSchema[] = [
  {
    label: '知识库id',
    fieldName: 'knowledgeId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    label: '知识库名称',
    fieldName: 'name',
    component: 'Input',
    rules: 'required',
  },
  {
    component: 'ApiSelect',
    label: '向量模型',
    fieldName: 'modelId',
    rules: 'required',
    componentProps: {
      placeholder: '请选择',
      clearable: true,
      api: aiModelPlatformRequestHandle.list,
      labelField: 'modelName',
      valueField: 'modelId',
    },
  },
  {
    label: '知识库描述',
    fieldName: 'description',
    component: 'Input',
    componentProps: {
      type: 'textarea',
      clearable: true,
    },
  },
  {
    label: '状态',
    fieldName: 'status',
    component: 'Select',
    rules: 'required',
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
      component: 'ApiSelect',
      label: '模型平台',
      fieldName: 'platformId',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        api: aiModelPlatformRequestHandle.list,
        labelField: 'name',
        valueField: 'platformId',
      },
    },
    {
      component: 'Input',
      label: '模型名称',
      fieldName: 'modelName',
    },
    {
      component: 'Input',
      label: '模型类型',
      fieldName: 'type',
    },
    {
      component: 'Input',
      label: '提供者',
      fieldName: 'provider',
    },
    {
      component: 'Select',
      label: '状态',
      fieldName: 'status',
      componentProps: {
        options: status,
        clearable: true,
      },
    },
  ],
};

const columns: VxeGridPropTypes.Columns<AiKnowledge> = [
  { field: 'platformName', title: '模型平台' },
  { field: 'modelName', title: '模型名称' },
  { field: 'description', title: '模型描述' },
  { field: 'type', title: '模型类型' },
  { field: 'provider', title: '提供者' },
  {
    field: 'status',
    title: '状态',
    cellRender: {
      name: 'Dict',
      props: {
        dict: 'status',
      },
    },
  },
  {
    field: 'action',
    slots: { default: 'action' },
    title: '操作',
  },
];
export const gridOptions: VxeGridProps.VxeGridProps<AiModelConfig> = {
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
