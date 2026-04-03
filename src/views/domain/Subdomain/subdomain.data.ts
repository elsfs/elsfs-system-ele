import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { Subdomain } from '#/api/domain/subdomain';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { z } from '#/adapter/form';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/domain/subdomain';
import { schemaName } from '#/api/schemaName';

dayjs.extend(relativeTime);

function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'subdomain', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'subdomain_id', // 主键名称
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
        placeholder: '搜索域名',
        clearable: true,
      },
      fieldName: 'domain',
      label: '域名',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '搜索标签',
        clearable: true,
      },
      fieldName: 'tagsRaw',
      label: '标签',
    },
  ],
};

export const formSchema: VbenFormSchema[] = [
  {
    label: 'subdomainId',
    fieldName: 'subdomainId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['subdomainId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'domainId',
    label: '域名ID',
    dependencies: {
      show: false,
      triggerFields: ['domainId'],
    },
  },

  {
    component: 'Input',
    fieldName: 'subdomainName',
    label: '域名',
    dependencies: {
      async rules(values) {
        const { subdomainName, subdomainId } = values;
        if (!subdomainName) {
          return 'required';
        }
        return z
          .string()
          .min(2, '域名名称长度不能小于2')
          .regex(
            /^([a-z0-9][-a-z0-9]{0,62}(\.[a-z0-9][-a-z0-9]{0,62})+)$/i,
            '输入的内容不是域名',
          )
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(subdomainName, subdomainId, 'subdomain_name'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['subdomainName'],
    },
  },
  {
    component: 'InputNumber',
    fieldName: 'port',
    label: '端口号',
    defaultValue: 443,
  },
  {
    component: 'ApiSelect',
    fieldName: 'groupId',
    label: '分组',
  },
  {
    component: 'Switch',
    fieldName: 'autoUpdate',
    label: '自动更新',
    defaultValue: true,
  },
  {
    component: 'Input',
    fieldName: 'remark',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注',
      type: 'textarea',
    },
  },
];
const columns: VxeGridPropTypes.Columns<Subdomain> = [
  {
    field: 'subdomainId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'subdomainName',
    title: '域名',
    slots: { default: 'subdomainName' },
  },
  {
    field: 'hostCount',
    title: '主机数量',
    slots: { default: 'hostCount' },
  },
  {
    field: 'port',
    title: '端口',
  },
  {
    field: 'checkTime',
    title: '检查时间',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).fromNow() : '无';
    },
  },
  {
    field: 'expireMonitor',
    title: '过期监测',
    formatter: ({ cellValue }) => {
      return cellValue ? '是' : '否';
    },
  },
  {
    field: 'autoUpdate',
    title: '自动更新',
    formatter: ({ cellValue }) => {
      return cellValue ? '是' : '否';
    },
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
      filename: '职务列表',
    },
  } as VxeGridProps<Subdomain>;
};

/** 详情页的字段 */
export function useDetailSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'subdomainId',
      label: '主键ID',
      show: () => false,
    },
    {
      field: 'subdomainName',
      label: '域名',
      render: (val) => {
        if (val === null || val === '') {
          return '无';
        }
        return h(
          'a',
          {
            href: `https://${val}`,
            target: '_blank',
            class: 'text-blue-500',
          },
          val,
        );
      },
    },
    {
      field: 'groupId',
      label: '分组',
    },
    {
      field: 'port',
      label: '端口',
    },
    {
      field: 'checkTime',
      label: '检查时间',
    },
    {
      field: 'hostCount',
      label: '主机数量',
    },

    {
      field: 'remark',
      label: '备注',
      render: (val) => {
        if (val === null || val === '') {
          return '-';
        }
        return val;
      },
    },
    {
      field: 'version',
      label: '数据版本号',
    },
    {
      field: 'createAt',
      label: '创建时间',
    },
    {
      field: 'updateAt',
      label: '更新时间',
    },
  ];
}
