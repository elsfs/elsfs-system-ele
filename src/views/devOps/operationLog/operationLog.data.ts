import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps } from '#/adapter/form';
import type { OperationLog } from '#/api/devOps/operationLog';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useRequestHandle } from '#/api/devOps/operationLog';

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
      component: 'VbenSelect',
      componentProps: {
        placeholder: '全部',
        clearable: true,
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      fieldName: 'requestMethod',
      label: '请求方式',
    },
    {
      component: 'VbenSelect',
      componentProps: {
        placeholder: '全部',
        clearable: true,
        options: [
          { label: '成功', value: 'success' },
          { label: '失败', value: 'fail' },
        ],
      },
      fieldName: 'status',
      label: '操作状态',
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入请求url',
        clearable: true,
      },
      fieldName: 'requestUrl',
      label: '请求url',
    },
    {
      component: 'VbenInput',
      componentProps: {
        clearable: true,
      },
      fieldName: 'description',
      label: '操作描述',
    },
    {
      component: 'VbenInput',
      componentProps: {
        clearable: true,
      },
      fieldName: 'module',
      label: '操作模块',
    },

  ],
};

const columns: VxeGridPropTypes.Columns<OperationLog> = [
  {
    field: 'operationLogId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'userId',
    title: '操作用户ID',
  },
  {
    field: 'username',
    title: '操作用户名',
  },
  {
    field: 'module',
    title: '操作模块',
  },
  {
    field: 'operationType',
    title: '操作类型',
  },
  {
    field: 'description',
    title: '操作描述',
  },
  {
    field: 'requestMethod',
    title: '请求方法',
  },
  {
    field: 'requestUrl',
    title: '请求URL',
  },
  {
    field: 'ip',
    title: '请求IP',
  },
  {
    field: 'executeTime',
    title: '执行时间',
  },
  {
    field: 'status',
    title: '操作状态',
  },
  {
    field: 'errorMsg',
    title: '错误信息',
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
      keyField: 'operationLogId',
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
      export: false,
      // import: true,
      refresh: true,
      zoom: true,
    },
  } as VxeGridProps<OperationLog>;
};
