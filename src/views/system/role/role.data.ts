import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { SysRole } from '#/api/system/sysRole';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { useRequestRole } from '#/api/core/api';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { schemaName } from '#/api/schemaName';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');
const { useRequestHandle } = useRequestRole;

function checkDate(
  fieldVal: any,
  dataId: string | undefined,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'sys_role', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'role_id', // 主键名称
  };
}

/**
 * @deprecated 角色信息接口
 */
export interface RoleItem {
  roleId: string;
  roleName: string;
  roleCode: string;
  createAt: string;
}

// 表格列配置接口
export interface TableColumn {
  label: string;
  prop?: string;
  type?: 'index';
  width?: number;
  fixed?: 'left' | 'right';
  slot?: string;
}
export const fromSchema: VbenFormSchema[] = [
  {
    component: 'Input',
    // 字段名
    fieldName: 'roleId',
    // 界面显示的label
    label: 'roleId',
    dependencies: {
      show: false,
      triggerFields: ['roleId'],
    },
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入角色名称',
    },
    dependencies: {
      async rules(values: SysRole) {
        const { roleName, roleId } = values;
        if (!roleName) {
          return 'required';
        }
        return z
          .string()
          .min(1, '角色名称长度不能小于1')
          .max(32, '角色名称不能大于32')
          .refine(
            async (val) => {
              // 只会在上面同步规则都通过后执行
              const { pass } = await doDuplicateCheckDebounced(
                checkDate(val, roleId, 'role_name'),
              );
              return pass;
            },
            { message: '角色名称已经存在' },
          );
      },
      triggerFields: ['roleName'],
    },
    // 字段名
    fieldName: 'roleName',
    // 界面显示的label
    label: '角色名称',
  },
  {
    component: 'Input',
    // 对应组件的参数
    componentProps: {
      placeholder: '请输入角色编码',
    },
    dependencies: {
      async rules(value: Partial<SysRole>, _) {
        const { roleCode, roleId } = value;
        if (!roleCode) {
          return 'required';
        }
        return z
          .string()
          .min(1, '角色编码长度不能小于1')
          .max(32, '角色编码不能大于32')
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(roleCode, roleId, 'role_code'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['roleCode'],
    },
    // 字段名
    fieldName: 'roleCode',
    label: '角色编码',
  },
  {
    component: 'InputNumber',
    // 对应组件的参数
    defaultValue: 9999,
    componentProps: {
      placeholder: '请输入排序',
    },
    rules: 'required',
    fieldName: 'orderNo',
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
    component: 'Input',
    fieldName: 'roleDesc',
    help: '备注说明',
    label: '备注',
  },
];

const columns: VxeGridPropTypes.Columns<SysRole> = [
  {
    field: 'roleId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  { field: 'roleName', title: '角色名称' },
  { field: 'roleCode', title: '角色编码' },
  { field: 'orderNo', title: '排序' },
  {
    field: 'status',
    title: '状态',
    cellRender: { name: 'Dict', props: { dict: 'status' } },
  },
  { field: 'createAt', title: '创建时间' },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];
export const useGridOptions = (
  isRecycle: boolean,
  beforeQuery?: () => void,
) => {
  return {
    columns,
    radioConfig: {
      highlight: true,
      checkRowKey: 'roleId',
    },
    rowConfig: {
      /**
       * 当鼠标点击行时，是否要高亮当前行
       */
      isCurrent: true,
      keyField: 'roleId',
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
          beforeQuery?.();
          if (isRecycle) {
            return useRequestHandle.logicPage(
              merge(
                {
                  current: page.currentPage,
                  pages: page.pageSize,
                },
                formValues,
              ),
            );
          }
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
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    exportConfig: {
      // 导出文件名
      filename: '角色列表',
    },
  } as VxeGridProps<SysRole>;
};

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
        placeholder: '请输入角色名称',
        clearable: true,
      },
      fieldName: 'roleName',
      label: '角色名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色编码',
        clearable: true,
      },
      fieldName: 'roleCode',
      label: '角色编码',
    },
    {
      component: 'Select',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: status,
      },
      fieldName: 'status',
      label: '状态',
    },
  ],
};
