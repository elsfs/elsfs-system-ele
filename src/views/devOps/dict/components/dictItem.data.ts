import type { VxeGridPropTypes } from 'vxe-table';

import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';

import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');

export interface DictItem {
  dictItemId: string;
  // 字典ID
  dictId: string;
  // 字典项名称
  label: string;
  // 字典项值
  value: string;
  // 字典ID
  parentId: string;
  // 深度 数结构深度
  depth: number;
  // 自定义字典类型或者分类
  customType: string;
  // 样式
  css: string;
  // 备注
  remark: string;
  // 图标
  icon: string;
  // 状态
  status: string;
  // 排序
  orderNo: number;
}
export const columns: VxeGridPropTypes.Columns<DictItem> = [
  {
    field: 'label',
    title: '字典项名称',
    width: 150,
    treeNode: true,
  },
  {
    field: 'value',
    title: '字典项值',
    width: 150,
  },
  {
    field: 'orderNo',
    title: '排序值',
    width: 60,
  },
  {
    field: 'status',
    title: '状态',
    width: 50,
    cellRender: {
      name: 'Dict',
      props: {
        dict: 'status',
      },
    },
  },
  {
    width: 120,
    field: 'customType',
    title: '自定义分类',
  },
  {
    width: 140,
    field: 'createAt',
    title: '创建时间',
  },
  { fixed: 'right', width: 250, slots: { default: 'action' }, title: '操作' },
];

export const searchSchemaFrom: VbenFormSchema[] = [
  {
    component: 'Input',
    /**
     * 在Label后显示一个冒号
     */
    colon: true,
    labelWidth: 80,
    fieldName: 'label',
    label: '字典项名称',
  },
];
export const gridOptions: VxeTableGridOptions = {
  columns,
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
export const searchFormOptions: VbenFormProps = {
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: true,
  resetButtonOptions: {
    show: false,
  },
  schema: searchSchemaFrom,
};
export const schemaFrom: VbenFormSchema[] = [
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入字典项名称',
    },
    rules: 'required',
    // 字段名
    fieldName: 'label',
    // 界面显示的label
    label: '字典项名称',
  },

  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入字典项值',
    },
    rules: 'required',
    // 字段名
    fieldName: 'value',
    // 界面显示的label
    label: '字典项值',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入自定义字典类型或者分类',
    },
    // 字段名
    fieldName: 'customType',
    // 界面显示的label
    label: '自定义字典类型或者分类',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入备注',
      type: 'textarea',
    },
    // 字段名
    fieldName: 'remark',
    // 界面显示的label
    label: '备注',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入样式',
    },
    // 字段名
    fieldName: 'css',
    // 界面显示的label
    label: '样式',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入图标',
    },
    // 字段名
    fieldName: 'icon',
    // 界面显示的label
    label: '图标',
  },
  {
    component: 'Input',
    // 对应组件的参数
    defaultValue: 0,
    rules: 'required',
    // 字段名
    fieldName: 'orderNo',
    // 界面显示的label
    label: '排序',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    rules: 'required',
    componentProps: {
      options: status,
    },
  },
  {
    component: 'ApiTreeSelect',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入父级字典项',
      childrenField: 'children',
      // 菜单接口转options格式
      labelField: 'label',
      valueField: 'dictItemId',
    },
    dependencies: {
      show: false,
      triggerFields: ['parentId'],
    },
    // 字段名
    fieldName: 'parentId',
    // 界面显示的label
    label: '父级字典项',
  },
  {
    // 组件需要在 #/adapter.ts内注册，并加上类型
    component: 'Input',
    // 字段名
    fieldName: 'dictItemId',
    componentProps: {
      type: 'hidden',
    },
    dependencies: {
      show: false,
      triggerFields: ['dictItemId'],
    },
  },
  {
    component: 'Input',
    // 字段名
    fieldName: 'dictId',
    rules: 'required',
    dependencies: {
      show: false,
      triggerFields: ['dictId'],
    },
  },
];
