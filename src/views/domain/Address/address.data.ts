import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormSchema } from '#/adapter/form';
import type { Address } from '#/api/domain/address';
import type { DescriptionItemSchema } from '#/components/description';

import { h } from 'vue';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useRequestHandle } from '#/api/domain/address';

dayjs.extend(relativeTime);

export const formSchema: VbenFormSchema[] = [
  {
    label: 'addressId',
    fieldName: 'addressId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['addressId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'subdomainId',
    label: '域名ID',
    dependencies: {
      show: false,
      triggerFields: ['subdomainId'],
    },
  },

  {
    component: 'Input',
    fieldName: 'host',
    label: '主机IP地址',
    rules: 'selectRequired',
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
const columns: VxeGridPropTypes.Columns<Address> = [
  {
    field: 'host',
    title: '主机地址',
  },
  {
    field: 'sslStartTime',
    title: 'SSL签发时间',
  },
  {
    field: 'sslExpireTime',
    title: 'SSL过期时间',
  },
  {
    field: 'sslExpireDays',
    title: 'SSL剩余天数',
    slots: {
      default: 'sslExpireDays',
    },
  },
  {
    field: 'checkTime',
    title: '检查时间',
    formatter: ({ cellValue }) => {
      return dayjs(cellValue).fromNow(); // 自动返回 "1小时前", "2天前" 等
    },
  },
  {
    field: 'remark',
    title: '备注说明',
    formatter: ({ cellValue }) => {
      if (cellValue === null || cellValue === '') {
        return '-';
      }
      return cellValue;
    },
  },
  { fixed: 'right', slots: { default: 'action' }, title: '操作' },
];

export const useGridOptions = (isRecycle: boolean) => {
  return {
    columns,
    height: 'auto',
    proxyConfig: {
      enabled: true,
      autoLoad: false, // 默认自动加载
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
    // 工具栏配置
    toolbarConfig: {
      enabled: true,
    },
    exportConfig: {
      // 导出文件名
      filename: '域名主机ip地址列表',
    },
  } as VxeGridProps<Address>;
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
