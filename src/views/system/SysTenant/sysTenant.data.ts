import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { SysTenant } from '#/api/system/sysTenant.ts';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { doDuplicateCheck } from '#/api/core/duplicateCheck';
import { checkDate, useRequestHandle } from '#/api/system/sysTenant.ts';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');

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
        placeholder: '请输入租户名称',
        clearable: true,
      },
      fieldName: 'tenantName',
      label: '租户名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入租户域名',
        clearable: true,
      },
      fieldName: 'tenantDomain',
      label: '租户域名',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入租户编码',
        clearable: true,
      },
      fieldName: 'tenantCode',
      label: '租户编码',
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

export const formSchema: VbenFormSchema[] = [
  {
    label: 'tenantId',
    fieldName: 'tenantId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    component: 'Input',
    fieldName: 'tenantName',
    label: '租户名称',
    dependencies: {
      async rules(values) {
        const { tenantName, tenantId } = values;
        if (!tenantName) {
          return z.string().min(1, { message: '租户名称不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(tenantName, tenantId, 'tenant_code'),
        );
        return z
          .string()
          .min(1, '租户名称长度不能小于1')
          .max(32, '租户名称长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['tenantName'],
    },
  },
  {
    component: 'Input',
    fieldName: 'tenantCode',
    label: '租户编码',
    dependencies: {
      async rules(values) {
        const { tenantCode, tenantId } = values;
        if (!tenantCode) {
          return z.string().min(1, { message: '租户编码不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(tenantCode, tenantId, 'tenant_code'),
        );
        return z
          .string()
          .min(1, '租户编码长度不能小于1')
          .max(32, '租户编码长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['tenantCode'],
    },
  },
  {
    component: 'Input',
    fieldName: 'tenantDomain',
    label: '租户域名',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'tenantContact',
    label: '租户联系人',
  },
  {
    component: 'Input',
    fieldName: 'tenantContactPhone',
    label: '租户联系人电话',
  },
  {
    component: 'Input',
    fieldName: 'tenantContactEmail',
    label: '租户联系人邮箱',
    rules: z.string().email(),
  },
  {
    component: 'Input',
    fieldName: 'tenantContactAddress',
    label: '租户联系地址',
  },
  {
    component: 'Input',
    fieldName: 'tenantLogo',
    label: '租户logo',
  },
  {
    component: 'InputNumber',
    fieldName: 'orderNo',
    defaultValue: 9999,
    label: '排序',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: {
      options: status,
    },
  },
];
const columns: VxeGridPropTypes.Columns<SysTenant> = [
  {
    field: 'tenantId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  { field: 'tenantName', title: '租户名称' },
  { field: 'tenantDomain', title: '租户域名' },
  { field: 'tenantCode', title: '租户编码' },
  { field: 'tenantContact', title: '租户联系人' },
  { field: 'tenantContactPhone', title: '租户联系人电话' },
  { field: 'tenantContactEmail', title: '租户联系人邮箱' },
  { field: 'tenantContactAddress', title: '租户联系地址' },
  { field: 'tenantLogo', title: '租户logo' },
  {
    field: 'orderNo',
    title: '排序',
  },
  {
    field: 'status',
    title: '状态',
    cellRender: { name: 'Dict', props: { dict: 'status' } },
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];

export const gridOptions: VxeGridProps.VxeGridProps<SysTenant> = {
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
    filename: '租户列表',
  },
};
