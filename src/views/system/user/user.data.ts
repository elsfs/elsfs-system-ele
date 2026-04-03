import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';

import { merge } from 'lodash';

import { z } from '#/adapter/form';
import { getUserBYRoleId } from '#/api';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { configItem } from '#/api/devOps/sysConfig';
import { schemaName } from '#/api/schemaName';
import { useRequestHandle as sysPostRequest } from '#/api/system/sysPost';
import { useRequestHandle } from '#/api/system/user';
import { useConfigStore } from '#/store';
import { useDict } from '#/utils/dictUtils';

const { status, sex } = useDict('status', 'sex');

function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'sys_user', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'user_id', // 主键名称
  };
}
export interface SysUserRow {
  userId: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  email: string;
  sex: string;
  birthday: string;
  status: string;
  createAt: string;
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
        placeholder: '请输入用户昵称',
        clearable: true,
      },
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        clearable: true,
      },
      fieldName: 'username',
      label: '用户名',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
        clearable: true,
      },
      fieldName: 'phone',
      label: '手机号',
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

const columns: VxeGridPropTypes.Columns<SysUserRow> = [
  {
    field: 'userId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  { field: 'username', title: '用户名', width: 150 },
  { field: 'nickname', title: '昵称', width: 150 },

  { field: 'email', title: '邮箱', width: 150 },

  {
    field: 'sex',
    title: '性别',
    width: 60,
    cellRender: { name: 'Dict', props: { dict: 'sex' } },
  },
  {
    field: 'status',
    title: '状态',
    width: 50,
    cellRender: { name: 'Dict', props: { dict: 'status' } },
  },
  {
    field: 'avatar',
    title: '头像',
    width: 100,
    cellRender: { name: 'CellImage' },
  },
  {
    field: 'birthday',
    title: '生日',
    width: 150,
  },
  {
    field: 'createAt',
    title: '创建时间',
    width: 150,
  },
  {
    field: 'updateAt',
    title: '创建时间',
    width: 150,
  },
  {
    field: 'action',
    title: '操作',
    width: 200,
    fixed: 'right',
    slots: { default: 'action' },
  },
];
// normal 正常用户 recycle回收站用户 role 角色用户
type QueryType = 'normal' | 'recycle' | 'role';
export const useGridOptions = (
  queryType: QueryType,
  parameter?: Record<string, any>,
) => {
  return {
    columns,
    pagerConfig: {
      enabled: queryType !== 'role',
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async ({ page }, formValues) => {
          const qry = merge(
            {
              current: page.currentPage,
              pages: page.pageSize,
            },
            formValues,
            parameter,
          );
          if (queryType === 'recycle') {
            return useRequestHandle.logicPage(qry);
          }
          if (queryType === 'role') {
            return getUserBYRoleId(qry.roleId);
          }
          return useRequestHandle.page(qry);
        },
      },
    },
    toolbarConfig: {
      enabled: true,
      // @ts-ignore 是否显示搜索表单控制按钮
      search: true,
      custom: true,
      export: true,
      // import: true,
      refresh: true,
      zoom: true,
    },
    exportConfig: {
      // 导出文件名
      filename: '用户列表',
    },
  } as VxeGridProps<SysUserRow>;
};

export const formSchema = (isUpdate: boolean): VbenFormSchema[] => {
  const useConfig = useConfigStore();
  // 是否允许用户添加多个职位
  const allowMultiplePost = useConfig.getConfigToBoolean(
    configItem.ENABLE_USER_MULTIPLE_POST,
  );
  // 是否允许用户添加多个部门
  const allowMultipleDept = useConfig.getConfigToBoolean(
    configItem.ENABLE_USER_MULTIPLE_DEPT,
  );
  return [
    {
      label: 'userId',
      fieldName: 'userId',
      component: 'Input',
      dependencies: {
        show: false,
        triggerFields: ['userId'],
      },
    },
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      dependencies: {
        async rules(values) {
          const { username, userId } = values;
          if (!username) {
            return 'required';
          }
          return z
            .string()
            .min(1, '用户名长度不能小于1')
            .max(32, '用户名长度不能大于32')
            .superRefine(async (_, ctx) => {
              const { pass, message } = await doDuplicateCheckDebounced(
                checkDate(username, userId, 'username'),
              );
              if (!pass) {
                ctx.addIssue({
                  message,
                  code: z.ZodIssueCode.custom, // 自定义错误类型
                });
              }
            });
        },
        triggerFields: ['username'],
      },
      componentProps: {
        placeholder: '请输入用户名',
        clearable: !isUpdate,
        disabled: isUpdate,
      },
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
      dependencies: {
        async rules(values) {
          const { nickname, userId } = values;
          if (!nickname) {
            return 'required';
          }
          return z
            .string()
            .min(1, '昵称长度不能小于1')
            .max(6, '昵称长度不能大于6')
            .superRefine(async (_, ctx) => {
              const { pass, message } = await doDuplicateCheckDebounced(
                checkDate(nickname, userId, 'nickname'),
              );
              if (!pass) {
                ctx.addIssue({
                  message,
                  code: z.ZodIssueCode.custom, // 自定义错误类型
                });
              }
            });
        },
        triggerFields: ['nickname'],
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      dependencies: {
        async rules(values) {
          const { email, userId } = values;
          if (!email) {
            return 'required';
          }
          return z
            .string()
            .nonempty()
            .email('邮箱格式不正确')
            .superRefine(async (_, ctx) => {
              const { pass, message } = await doDuplicateCheckDebounced(
                checkDate(email, userId, 'email'),
              );
              if (!pass) {
                ctx.addIssue({
                  message,
                  code: z.ZodIssueCode.custom, // 自定义错误类型
                });
              }
            });
        },
        triggerFields: ['email'],
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      dependencies: {
        async rules(values) {
          const { phone, userId } = values;
          if (!phone) {
            return 'required';
          }
          return z
            .string()
            .regex(/^1[3-9]\d{9}$/, '手机号必须是11位数字')
            .refine(
              async (val) => {
                // 只会在上面同步规则都通过后执行
                const { pass } = await doDuplicateCheckDebounced(
                  checkDate(val, userId, 'phone'),
                );
                return pass;
              },
              { message: '手机号已存在' },
            );
        },
        triggerFields: ['phone'],
      },
    },
    {
      component: 'Input',
      fieldName: 'avatar',
      label: '头像',
      componentProps: {
        accept: 'image/*',
        limit: 1,
        multiple: false,
        listType: 'picture-card',
        uploadText: '上传头像',
        action: '/api/system/file/upload',
      },
    },
    {
      component: 'DatePicker',
      fieldName: 'birthday',
      label: '生日',
      componentProps: {
        type: 'date',
        clearable: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'sex',
      label: '性别',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: sex,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      defaultValue: '0',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: status,
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'postIds',
      label: '岗位',
      rules: z
        .array(z.string().min(1, '请选择岗位').max(32, '岗位长度不能大于32'))
        .min(1, '请选择岗位')
        .max(allowMultiplePost ? 999 : 1, '最多只能选择一个岗位')
        .default([]),
      componentProps: {
        class: 'w-full',
        props: {
          label: 'postName',
          children: 'children',
          value: 'postId',
        },
        showCheckbox: true,
        multiple: true,
        multipleLimit: allowMultiplePost ? 0 : 1, // multiple 属性设置为 true 时，代表多选场景下用户最多可以选择的项目数， 为 0 则不限制
        nodeKey: 'postId',
        api: async (query: any) => {
          return await sysPostRequest.list(query);
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'deptIds',
      label: '所属部门',
      componentProps: {
        props: {
          label: 'deptName',
          children: 'children',
        },
        showCheckbox: allowMultipleDept,
        multiple: true,
        nodeKey: 'deptId',
      },
    },
  ];
};
