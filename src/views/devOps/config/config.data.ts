import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { SysConfig } from '#/api/devOps/sysConfig';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { doDuplicateCheck } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/devOps/sysConfig';
import { schemaName } from '#/api/schemaName';
import { useDict } from '#/utils/dictUtils';

const { configType } = useDict('configType');

function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'sys_config', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'config_id', // 主键名称
  };
}

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
        placeholder: '请输入配置KEY',
        clearable: true,
      },
      fieldName: 'configKey',
      label: '配置KEY',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置名称',
        clearable: true,
      },
      fieldName: 'configName',
      label: '配置名称',
    },
  ],
};

export const formSchema: VbenFormSchema[] = [
  {
    label: '配置ID',
    fieldName: 'configId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    component: 'Input',
    fieldName: 'configKey',
    label: '配置KEY',
    dependencies: {
      async rules(values) {
        const { configKey, configId } = values;
        if (!configKey) {
          return z.string().min(1, { message: '配置KEY不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(configKey, configId, 'config_key'),
        );
        return z
          .string()
          .min(1, '配置KEY长度不能小于1')
          .max(32, '配置KEY长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['configKey'],
    },
  },
  {
    component: 'Input',
    fieldName: 'configName',
    label: '配置名称',
    dependencies: {
      async rules(values) {
        const { configName, configId } = values;
        if (!configName) {
          return z.string().min(1, { message: '配置名称不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(configName, configId, 'config_name'),
        );
        return z
          .string()
          .min(1, '配置名称长度不能小于1')
          .max(32, '配置名称不能大于32')
          .refine(() => pass, { message });
      },
      triggerFields: ['configName'],
    },
  },
  {
    component: 'Input',
    fieldName: 'configValue',
    label: '配置值',
    rules: 'required',
  },
  {
    component: 'Select',
    fieldName: 'configType',
    label: '配置类型',
    rules: 'required',
    defaultValue: '1',
    componentProps: {
      options: configType,
    },
  },
  {
    component: 'Input',
    fieldName: 'remark',
    label: '备注',
    componentProps: {
      type: 'textarea',
      placeholder: '请输入备注',
      clearable: true,
    },
  },
];
const columns: VxeGridPropTypes.Columns<SysConfig> = [
  {
    field: 'configId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  { field: 'configKey', title: '配置KEY' },
  { field: 'configName', title: '配置名称' },
  { field: 'configValue', title: '配置值' },
  {
    field: 'configType',
    title: '配置类型',
    cellRender: { name: 'Dict', props: { dict: 'configType' } },
  },
  { field: 'remark', title: '配置描述' },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];

export const gridOptions: VxeGridProps<SysConfig> = {
  columns,
  checkboxConfig: {
    checkField: 'configId',
    highlight: true,
    range: true,
    strict: true,
    visibleMethod({ row }) {
      return row.configType !== '0';
    },
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
  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    enabled: true,
    // @ts-ignore 正式环境时有完整的类型声明
    search: true,
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
  exportConfig: {
    // 导出文件名
    filename: '职务列表',
  },
};
