import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { GenDatasourceConf } from '#/api/developer/genDatasourceConf';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { doDuplicateCheck } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/developer/genDatasourceConf';
import { schemaName } from '#/api/schemaName';

function checkDate(fieldVal, dataId, fieldName): DuplicateCheckQry {
  return {
    schemaName: schemaName.codegen, // 数据库名
    tableName: 'gen_datasource_conf', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'id', // 主键名称
  };
}

export const formSchema: VbenFormSchema[] = [
  {
    label: '配置ID',
    fieldName: 'id',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '数据源名称',
    dependencies: {
      async rules(values) {
        const { name, id } = values;
        if (!name) {
          return z.string().min(1, { message: '数据源名称不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(name, id, 'name'),
        );
        return z
          .string()
          .min(1, '数据源名称长度不能小于1')
          .max(32, '数据源名称长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['name'],
    },
  },
  {
    component: 'Select',
    fieldName: 'dsType',
    label: '数据源类型',
    rules: 'required',
    componentProps: {
      options: [
        // db2' | 'dm' | 'highgo' | 'mssql' | 'mysql' | 'oracle' | 'pg'
        { label: 'DB2', value: 'db2' },
        { label: '达梦', value: 'dm' },
        { label: '高斯', value: 'highgo' },
        { label: 'MSSQL', value: 'mssql' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'Oracle', value: 'oracle' },
        { label: 'PostgreSQL', value: 'pg' },
      ],
    },
  },
  {
    component: 'RadioGroup',
    fieldName: 'confType',
    label: '配置类型',
    rules: 'required',
    defaultValue: '0',
    componentProps: {
      options: [
        // 配置类型 （0 主机形式 | 1 url形式）
        { label: '主机形式', value: '0' },
        { label: 'url形式', value: '1' },
      ],
    },
  },
  {
    component: 'Input',
    fieldName: 'username',
    label: '用户名',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'password',
    label: '密码',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'host',
    label: '主机',
    rules: 'required',
    dependencies: {
      if(values) {
        return values.confType === '0';
      },
      triggerFields: ['confType'],
    },
  },
  {
    component: 'InputNumber',
    fieldName: 'port',
    label: '端口',
    rules: 'required',
    dependencies: {
      if(values) {
        return values.confType === '0';
      },
      triggerFields: ['confType'],
    },
  },
  {
    component: 'Input',
    fieldName: 'dsName',
    label: '数据库名称',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'url',
    label: 'jdbc-url',
    rules: 'required',
    dependencies: {
      if(values) {
        return values.confType === '1';
      },
      triggerFields: ['confType'],
    },
  },

  {
    component: 'Input',
    fieldName: 'instance',
    label: '实例',
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
        placeholder: '请输入数据源名称',
        clearable: true,
      },
      fieldName: 'name',
      label: '数据源名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入数据库名称',
        clearable: true,
      },
      fieldName: 'dsName',
      label: '数据库名称',
    },
  ],
};

const columns: VxeGridPropTypes.Columns<GenDatasourceConf> = [
  {
    field: 'id',
    align: 'left',
    type: 'checkbox',
    width: 100,
  },
  { field: 'name', title: '数据源名称', width: 100 },
  { field: 'dsType', title: '数据源类型', width: 80 },
  {
    field: 'confType',
    title: '配置类型',
    width: 80,
    formatter: ({ row }) => {
      return row.confType === '0' ? '主机形式' : 'url形式';
    },
  },
  {
    field: 'host',
    title: '主机',
    width: 100,
  },
  { field: 'port', title: '端口', width: 50 },
  { field: 'url', title: 'jdbc-url', width: 160 },
  { field: 'instance', title: '实例', width: 120 },
  { field: 'dsName', title: '数据库名称', width: 100 },
  { field: 'username', title: '用户名', width: 100 },
  {
    field: 'state',
    title: '状态',
    width: 50,
    cellRender: { name: 'Dict', props: { dict: 'status' } },
  },
  { field: 'createAt', title: '创建时间', width: 140 },

  {
    fixed: 'right',
    field: 'action',
    slots: { default: 'action' },
    width: 200,
    title: '操作',
  },
];

export const gridOptions: VxeGridProps.VxeGridProps<GenDatasourceConf> = {
  columns,
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
  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    enabled: true,
    search: true,
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
  exportConfig: {
    // 导出文件名
    filename: '数据源列表',
  },
};
