import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DmHost } from '#/api/domain/dmHost';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { z } from '#/adapter/form';
import { useRequestHandle } from '#/api/domain/dmHost';

dayjs.extend(relativeTime);

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
        placeholder: '搜索域名',
        clearable: true,
      },
      fieldName: 'domain',
      label: '域名',
    },
  ],
};

export const formSchema: VbenFormSchema[] = [
  {
    label: 'hostId',
    fieldName: 'hostId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['hostId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'host',
    label: '主机地址',
    rules: z
      .string()
      .regex(
        /^((2(5[0-5]|[0-4]\d))|[01]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[01]?\d{1,2})){3}$/,
        '请输入正确的主机地址',
      ),
    formItemClass: 'flex-1',
    componentProps: {
      placeholder: '请输入主机地址',
    },
  },

  {
    component: 'InputNumber',
    fieldName: 'port',
    label: '',
    rules: z
      .number({
        message: '请输入正确端口号',
      })
      .min(1, '请输入正确端口号')
      .max(65_535, '请输入正确端口号'),
    defaultValue: 22,
    componentProps: {
      placeholder: '端口号',
      controlsPosition: 'right',
    },
  },
  {
    component: 'Input',
    fieldName: 'user',
    label: '用户名',
    rules: 'required',
    componentProps: {
      placeholder: '请输入用户名',
    },
  },
  {
    component: 'Select',
    fieldName: 'authType',
    label: '验证方式',
    rules: 'required',
    defaultValue: 1,
    componentProps: {
      options: [
        {
          label: '密码',
          value: 1,
        },
        {
          label: '私钥证书',
          value: 2,
        },
      ],
    },
  },
  {
    component: 'Input',
    fieldName: 'privateKey',
    label: '私钥证书',
    componentProps: {
      placeholder: '证书内容（.pem文件）',
      rows: 6,
      type: 'textarea',
    },
    dependencies: {
      triggerFields: ['authType'],
      rules: (row) => {
        if (row.authType === 2) {
          return 'required';
        }
      },
      show: (val) => {
        return val.authType === 2;
      },
    },
  },
  {
    component: 'VbenInputPassword',
    fieldName: 'password',
    label: '密码',
    componentProps: {
      placeholder: '请输入密码',
    },
    dependencies: {
      triggerFields: ['authType'],
      rules: (row) => {
        if (row.authType === 1) {
          return 'required';
        }
      },
      show: (val) => {
        return val.authType === 1;
      },
    },
  },
];
const columns: VxeGridPropTypes.Columns<DmHost> = [
  {
    field: 'hostId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'host',
    title: '远程主机地址',
  },
  {
    field: 'port',
    title: '端口号',
  },
  {
    field: 'user',
    title: '登录账号',
  },
  {
    field: 'authType',
    title: '验证方式',
    formatter: ({ cellValue }) => {
      if (cellValue === 1) {
        return '密码验证';
      }
      return '私钥验证';
    },
  },
  {
    field: 'remark',
    title: '备注',
  },
  {
    field: 'createAt',
    title: '创建时间',
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];

export const useGridOptions = (isRecycle: boolean) => {
  return {
    columns,
    height: 'auto',
    keepSource: true,
    rowConfig: {
      /**
       * 是否需要为每一行的 VNode 设置 key 属性
       */
      useKey: true,
      /**
       * 自定义行数据唯一主键的字段名（默认自动生成）
       */
      keyField: 'postId',
      /**
       * 当鼠标点击行时，是否要高亮当前行
       */
      isCurrent: true,
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async (_, formValues) => {
          if (isRecycle) {
            return useRequestHandle.logicPage({
              ...formValues,
            });
          }
          return useRequestHandle.page({
            ...formValues,
          });
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
      filename: '证书托管',
    },
  } as VxeGridProps<DmHost>;
};
