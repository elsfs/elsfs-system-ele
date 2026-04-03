import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { AiEmbeddingStore } from '#/api/admin/aiEmbeddingStore';

import { merge } from 'lodash';

import { useRequestHandle } from '#/api/ai/aiEmbeddingStore';
import { useDict } from '#/utils/dictUtils';

const { confType, storeType, status } = useDict(
  'confType',
  'status',
  'storeType',
);
const isHost = (confType) => confType === '0';

// 表单
export const formSchema: VbenFormSchema[] = [
  {
    label: '配置id',
    fieldName: 'storeId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    label: '配置类型',
    fieldName: 'confType',
    component: 'RadioGroup',
    defaultValue: '0',
    rules: 'required',
    componentProps: {
      options: confType,
    },
  },

  {
    label: '名称',
    fieldName: 'name',
    rules: 'required',
    component: 'Input',
  },

  {
    label: '类型',
    fieldName: 'storeType',
    component: 'Select',
    rules: 'required',
    componentProps: {
      options: storeType,
    },
  },

  {
    label: '密钥',
    fieldName: 'apiKey',
    component: 'Input',
  },

  {
    label: 'url',
    fieldName: 'url',
    component: 'Input',
    dependencies: {
      async rules(values) {
        if (!isHost(values.confType)) {
          return 'required';
        }
      },
      show(values) {
        return !isHost(values.confType);
      },
      triggerFields: ['confType'],
    },
  },

  {
    label: 'host',
    fieldName: 'host',
    component: 'Input',
    dependencies: {
      async rules(values) {
        if (isHost(values.confType)) {
          return 'required';
        }
      },
      show(values) {
        return isHost(values.confType);
      },
      triggerFields: ['confType'],
    },
  },

  {
    label: '端口',
    fieldName: 'port',
    component: 'Input',
    dependencies: {
      async rules(values) {
        if (isHost(values.confType)) {
          return 'required';
        }
      },
      show(values) {
        return isHost(values.confType);
      },
      triggerFields: ['confType'],
    },
  },

  {
    label: '数据库',
    fieldName: 'extData',
    component: 'Input',
    rules: 'required',
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
      component: 'Select',
      label: '配置类型',
      fieldName: 'confType',
      componentProps: {
        clearable: true,
        options: confType,
      },
    },

    {
      component: 'Input',
      label: '名称',
      fieldName: 'name',
    },

    {
      component: 'Select',
      label: '类型',
      fieldName: 'storeType',
      componentProps: {
        clearable: true,
        options: storeType,
      },
    },
    {
      component: 'Input',
      label: '数据库',
      fieldName: 'extData',
    },

    {
      component: 'Select',
      label: '状态',
      fieldName: 'status',
      componentProps: {
        clearable: true,
        options: status,
      },
    },
  ],
};

const columns: VxeGridPropTypes.Columns<AiEmbeddingStore> = [
  {
    field: 'confType',
    title: '配置类型',
    cellRender: {
      name: 'Dict',
      props: {
        dict: 'confType',
      },
    },
  },
  { field: 'name', title: '名称' },
  {
    field: 'storeType',
    title: '类型',
    cellRender: {
      name: 'Dict',
      props: {
        dict: 'storeType',
      },
    },
  },
  { field: 'extData', title: '数据库' },
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
export const gridOptions: VxeGridProps.VxeGridProps<AiEmbeddingStore> = {
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
