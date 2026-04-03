import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { GenDatasourceConf } from '#/api/developer/genDatasourceConf';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { doDuplicateCheck } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/developer/genDatasourceConf';
import { tablePage } from '#/api/developer/table';
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
    dependencies: {
      if(values) {
        return values.confType === '0';
      },
      triggerFields: ['confType'],
    },
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
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择',
        clearable: true,
        api: useRequestHandle.list,
        labelField: 'dsName',
        valueField: 'name',
      },
      fieldName: 'dsName',
      label: '数据源名称',
    },
  ],
};

const columns: VxeGridPropTypes.Columns<GenDatasourceConf> = [
  { field: 'tableName', title: '表名', width: 150 },
  { field: 'dsName', title: '数据源名称', width: 80 },
  { field: 'tableComment', title: '表注释', width: 140 },

  {
    field: 'primaryKey',
    title: '主键',
    width: 80,
  },
  {
    field: 'tableCatalog',
    title: '表目录',
    width: 100,
  },
  { field: 'tableSchema', title: '表模式', width: 50 },
  { field: 'tableType', title: '表类型', width: 160 },
  { field: 'engine', title: '存储引擎', width: 120 },
  { field: 'version', title: '版本', width: 100 },
  { field: 'rowFormat', title: '行格式', width: 100 },
  {
    field: 'tableRows',
    title: '行数',
    width: 50,
  },
  { field: 'avgRowLength', title: '平均行长度', width: 140 },
  { field: 'dataLength', title: '数据长度', width: 140 },
  { field: 'maxDataLength', title: '最大行长度', width: 140 },
  { field: 'indexLength', title: '索引长度', width: 140 },
  { field: 'dataFree', title: '未使用长度', width: 140 },
  { field: 'autoIncrement', title: '自动递增', width: 140 },
  { field: 'createTime', title: '创建时间', width: 140 },
  { field: 'updateTime', title: '更新时间', width: 140 },
  { field: 'checkTime', title: '检查时间', width: 140 },
  { field: 'tableCollation', title: '字符集', width: 140 },
  { field: 'createOptions', title: '创建选项', width: 140 },
  { field: 'checksum', title: '校验和', width: 140 },

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
        return tablePage(
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
const tableColumns: VxeGridPropTypes.Columns<GenDatasourceConf> = [
  { field: 'tableCatalog', title: '目录', width: 150 },
  { field: 'tableSchema', title: '模式 库名', width: 80 },
  { field: 'tableName', title: '表名', width: 140 },
  { field: 'columnComment', title: '字段描述', width: 140 },
  { field: 'columnName', title: '字段名', width: 140 },
  { field: 'ordinalPosition', title: '字段位置 排序', width: 140 },
  { field: 'columnDefault', title: '默认值', width: 140 },
  { field: 'isNullable', title: '是否为空', width: 140 },
  { field: 'dataType', title: '字段类型', width: 140 },
  { field: 'characterMaximumLength', title: '最大长度', width: 140 },
  { field: 'characterOctetLength', title: '字节长度', width: 140 },
  { field: 'numericPrecision', title: '精度', width: 140 },
  { field: 'numericScale', title: '小数位数', width: 140 },
  { field: 'datetimePrecision', title: '日期精度', width: 140 },
  { field: 'characterSetName', title: '字符集', width: 140 },
  { field: 'collationName', title: '排序规则', width: 140 },
  { field: 'columnType', title: '字符集', width: 140 },
  { field: 'columnKey', title: '字段键值 pri 主键 mul 多重索引', width: 140 },
  { field: 'extra', title: '额外信息', width: 140 },
  { field: 'privileges', title: '权限', width: 140 },
  { field: 'generationExpression', title: '表达式', width: 140 },
  { field: 'srsId', title: '空间id', width: 140 },
];
export const tableColumnGridOptions: VxeGridProps.VxeGridProps<GenDatasourceConf> =
  {
    columns: tableColumns,
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
