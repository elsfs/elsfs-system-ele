import type { VxeGridPropTypes } from 'vxe-table';

import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { SysDict } from '#/api/devOps/dict';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/devOps/dict';
import { schemaName } from '#/api/schemaName';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');
function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'std_dict', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'dict_id', // 主键名称
  };
}
const dictColumns: VxeGridPropTypes.Columns<SysDict> = [
  {
    field: 'dictId',
    type: 'checkbox',
    width: 50,
    fixed: 'left',
  },
  {
    field: 'dictName',
    title: '字典名称',
    treeNode: true,
    align: 'left',
    fixed: 'left',
    width: 300,
    slots: { default: 'dictName' },
  },
  {
    field: 'dictCode',
    title: '字典code',
    width: 150,
    align: 'left',
    fixed: 'left',
  },
  {
    field: 'tableName',
    title: '字典表名',
    width: 100,
  },
  {
    field: 'isIndependence',
    title: '独立数据表', // 是否有独立数据表 配合table_name使用，0表示无独立数据表，1表示有独立数据表
    width: 100,
    formatter: (params) => {
      return params.row.isIndependence ? '是' : '否';
    },
  },
  {
    field: 'allowAdding',
    title: '添加', // 是否是树形结构
    width: 50,
    formatter: (params) => {
      return params.row.allowAdding ? '允许' : '禁止';
    },
  },
  {
    width: 150,
    field: 'stdNo',
    title: '标准号',
  },
  {
    width: 150,
    field: 'stdCategory',
    title: '标准类别',
  },
  {
    width: 150,
    field: 'stdReplace',
    title: '全部代替标准',
  },
  {
    width: 150,
    field: 'ccs',
    title: '中国标准分类号',
  },
  {
    width: 150,
    field: 'ics',
    title: '国际标准分类号',
  },
  {
    field: 'dictDesc',
    title: '字典描述',
    width: 150,
  },
  {
    field: 'dictType',
    title: '标准类型',
    width: 150,
  },
  {
    field: 'website',
    title: '参考网站',
    width: 150,
  },
  {
    field: 'remark',
    title: '备注',
    width: 150,
  },
  {
    field: 'releaseDate',
    title: '发布日期',
    width: 120,
  },
  {
    field: 'implementationDate',
    title: '实施日期',
    width: 120,
  },
  {
    field: 'revocatoryDate',
    title: '废止日期',
    width: 120,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 160,
  },
];

export const dictGridOptions: VxeTableGridOptions = {
  columns: dictColumns,
  radioConfig: {
    highlight: true,
    checkRowKey: 'dictId',
  },
  rowConfig: {
    /**
     * 当鼠标点击行时，是否要高亮当前行
     */
    isCurrent: true,
    keyField: 'dictId',
  },
  // 启用列选中功能
  columnConfig: {
    isCurrent: true,
  },
  keepSource: true,
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: ({ page }, formValues) => {
        return useRequestHandle.page(
          merge(
            {
              current: page.currentPage,
              size: page.pageSize,
            },
            formValues,
          ),
        );
      },
    },
  },
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
  exportConfig: {},
};
export const dictSearchFormOptions: VbenFormProps = {
  // 默认展开
  collapsed: true,
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
      /**
       * 在Label后显示一个冒号
       */
      colon: true,
      componentProps: {
        placeholder: '请输入分类名称',
        clearable: true,
        style: {
          width: '240px',
        },
      },
      labelWidth: 70,
      fieldName: 'dictName',
      label: '字典名称',
    },
    {
      component: 'Input',
      /**
       * 在Label后显示一个冒号
       */
      colon: true,
      componentProps: {
        placeholder: '请输入字典表名',
        clearable: true,
        style: {
          width: '240px',
        },
      },
      labelWidth: 70,
      fieldName: 'tableName',
      label: '字典表名',
    },
    {
      component: 'Input',
      colon: true,
      componentProps: {
        placeholder: '请输入字典编码',
        clearable: true,
        style: {
          width: '240px',
        },
      },
      labelWidth: 70,
      fieldName: 'dictCode',
      label: '字典编码',
    },
    {
      component: 'Input',
      colon: true,
      componentProps: {
        placeholder: '请输入标准号',
        clearable: true,
        style: {
          width: '240px',
        },
      },
      labelWidth: 70,
      fieldName: 'stdNo',
      label: '标准号',
    },
  ],
};
export const dictSchemaFrom: VbenFormSchema[] = [
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入字典名称',
    },
    dependencies: {
      async rules(values) {
        const { dictName, dictId } = values;
        if (!dictName) {
          return 'required';
        }
        return z
          .string()
          .min(1, '字典名称长度不能小于1')
          .max(32, '字典名称长度不能大于32')
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(dictName, dictId, 'dict_name'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['dictName'],
    },
    // 字段名
    fieldName: 'dictName',
    // 界面显示的label
    label: '字典名称',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入字典编码',
    },
    dependencies: {
      async rules(values) {
        const { dictCode, dictId } = values;
        if (!dictCode) {
          return 'required';
        }
        return z
          .string()
          .min(1, '字典编码长度不能小于1')
          .max(32, '字典编码长度不能大于32')
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(dictCode, dictId, 'dict_code'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['dictCode'],
    },

    // 字段名
    fieldName: 'dictCode',
    label: '字典编码',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入表名',
    },
    dependencies: {
      if(values) {
        return !!values.isIndependence;
      },
      rules: (values) => {
        return values?.isIndependence ? 'required' : null;
      },
      // 只有指定的字段改变时，才会触发
      triggerFields: ['isIndependence'],
    },
    // 字段名
    fieldName: 'tableName',
    help: '表名 null表示在std_dict_item表，标准的基本上在该表',
    label: '表名',
  },
  {
    component: 'Switch',
    rules: 'required',
    // 字段名
    fieldName: 'isIndependence',
    help: '是否有独立数据表 配合table_name使用，false表示无独立数据表，true表示有独立数据表',
    defaultValue: false,
    label: '独立数据表',
  },
  {
    component: 'Switch',
    rules: 'required',
    // 字段名
    fieldName: 'isTree',
    help: '是否是树形结构',
    defaultValue: false,
    label: '树形结构',
  },

  {
    component: 'Switch',
    rules: 'required',
    // 字段名
    fieldName: 'allowAdding',
    help: '允许添加字典项',
    defaultValue: true,
    label: '允许添加',
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
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入标准号',
    },
    // 字段名
    fieldName: 'stdNo',
    label: '标准号',
  },

  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入标准类别',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    // 字段名
    fieldName: 'stdCategory',
    label: '标准类别',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入全部代替标准',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    // 字段名
    fieldName: 'stdReplace',
    label: '全部代替标准',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入中国标准分类号',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    // 字段名
    fieldName: 'ccs',
    help: '中国标准分类号(chinese classification for standards) 字典 css ',
    label: '中国标准分类号',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入国际标准分类号',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    // 字段名
    fieldName: 'ics',
    help: '国际标准分类号(international classification for standards) 字典 ics',
    label: '国际标准分类号',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入参考网站',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    // 字段名
    fieldName: 'website',
    label: '参考网站',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入标准类型',
    },
    // 字段名
    fieldName: 'dictType',
    label: '标准类型',
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入发布日期',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    fieldName: 'releaseDate',
    label: '发布日期',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入实施日期',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    fieldName: 'implementationDate',
    label: '实施日期',
  },
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入废止日期',
    },
    dependencies: {
      triggerFields: ['stdNo'],
      if(values) {
        return !!values.stdNo;
      },
    },
    fieldName: 'revocatoryDate',
    label: '废止日期',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入字典描述',
    },
    // 字段名
    fieldName: 'dictDesc',
    label: '字典描述',
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
    label: '备注',
  },
  {
    // 组件需要在 #/adapter.ts内注册，并加上类型
    component: 'Input',
    // 字段名
    fieldName: 'dictId',
    dependencies: {
      show: false,
      triggerFields: ['menuId'],
    },
  },
];
