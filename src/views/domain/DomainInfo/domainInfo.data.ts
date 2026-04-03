import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { DomainInfo } from '#/api/domain/domainInfo';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { z } from '#/adapter/form';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { useRequestHandle } from '#/api/domain/domainInfo';
import { schemaName } from '#/api/schemaName';

dayjs.extend(relativeTime);
function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'domain_info', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'domain_info_id', // 主键名称
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
    label: 'domainInfoId',
    fieldName: 'domainInfoId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['domainInfoId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'domain',
    label: '域名',
    dependencies: {
      async rules(values) {
        const { domain, domainInfoId } = values;
        if (!domain) {
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
              checkDate(domain, domainInfoId, 'domain'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['domain'],
    },
  },

  {
    component: 'DatePicker',
    fieldName: 'domainTime',
    label: '域名时间',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '-',
      format: 'YYYY-MM-DD',
      startPlaceholder: '域名注册时间',
      endPlaceholder: '域名过期时间',
    },
    dependencies: {
      triggerFields: ['autoUpdate'],
      disabled: (values) => {
        return values.autoUpdate;
      },
    },
  },
  {
    component: 'Switch',
    fieldName: 'autoUpdate',
    label: '自动更新',
    defaultValue: true,
  },
  {
    component: 'Switch',
    fieldName: 'expireMonitor',
    label: '域名过期监测',
    defaultValue: true,
  },
  {
    component: 'ApiSelect',
    fieldName: 'groupId',
    label: '分组',
  },
  {
    component: 'Input',
    fieldName: 'tagsRaw',
    label: '标签',
  },
  {
    component: 'Input',
    fieldName: 'icpCompany',
    label: '主办单位',
  },
  {
    component: 'Input',
    fieldName: 'icpLicence',
    label: 'ICP备案',
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
const columns: VxeGridPropTypes.Columns<DomainInfo> = [
  {
    field: 'domainInfoId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'domain',
    title: '根域名',
    slots: { default: 'domain' },
  },
  {
    field: 'domainExpireDays',
    title: '域名过期剩余天数',
    className: (params) =>
      (params.row.domainExpireDays as number) <= 0
        ? 'text-red-500'
        : 'text-green-500',
  },
  {
    field: 'domainExpireTime',
    title: '域名过期时间',
  },
  {
    field: 'updateWhoisTime',
    title: '更新whois信息时间',
    formatter: ({ cellValue }) => {
      return dayjs(cellValue).fromNow(); // 自动返回 "1小时前", "2天前" 等
    },
  },
  {
    field: 'expireMonitor',
    title: '域名过期监测',
    formatter: ({ cellValue }) => {
      return cellValue ? '是' : '否';
    },
  },
  {
    field: 'autoUpdate',
    title: '域名信息自动更新',
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
  } as VxeGridProps<DomainInfo>;
};

/** 详情页的字段 */
export function useDetailSchema(): DescriptionItemSchema[] {
  return [
    {
      field: 'domainInfoId',
      label: '主键ID',
    },
    {
      field: 'groupId',
      label: '分组ID',
      show: () => false,
    },
    {
      field: 'domain',
      label: '域名',
    },
    {
      field: 'remark',
      label: '备注',
      render: (val) => {
        if (val === null || val === '') {
          return '无';
        }
        return val;
      },
    },
    {
      field: 'domainRegistrar',
      label: '域名注册商',
    },
    {
      field: 'domainRegistrarUrl',
      label: '域名注册商地址',
      render: (val) => {
        if (val === null || val === '') {
          return '无';
        }
        return h(
          'a',
          {
            href: val, // 或具体的链接地址
            target: '_blank',
            class: 'text-blue-500',
          },
          val,
        );
      },
    },
    {
      field: 'domainStartTime',
      label: '域名注册时间',
    },
    {
      field: 'domainExpireTime',
      label: '域名过期时间',
    },
    {
      field: 'domainExpireDays',
      label: '域名过期剩余天数',
      render: (val) => {
        return h(
          'span',
          {
            style: {
              color: val > 0 ? 'green' : 'red',
            },
          },
          val,
        );
      },
    },
    {
      field: 'autoUpdate',
      label: '域名信息自动更新',
      render: (val) => {
        return val ? '是' : '否';
      },
    },
    {
      field: 'expireMonitor',
      label: '域名过期监测',
      render: (val) => {
        return val ? '是' : '否';
      },
    },
    {
      field: 'icpCompany',
      label: '主办单位名称',
    },
    {
      field: 'icpLicence',
      label: 'ICP备案/许可证号',
    },
    {
      field: 'tagsRaw',
      label: '标签',
      slot: 'tagsRaw',
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
