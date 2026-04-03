import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { DmDnsAccount } from '#/api/domain/dmDnsAccount';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { useRequestHandle } from '#/api/domain/dmDnsAccount';
import { schemaName } from '#/api/schemaName';

dayjs.extend(relativeTime);
function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'dm_certificate', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'certificate_id', // 主键名称
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
  ],
};

export const formSchema: VbenFormSchema[] = [
  {
    label: 'dnsAccountId',
    fieldName: 'dnsAccountId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['dnsAccountId'],
    },
  },
  {
    component: 'Select',
    fieldName: 'dnsType',
    label: '类型',
    rules: 'required',
    componentProps: {
      placeholder: '请选择类型',
      options: [
        {
          label: '阿里云',
          value: 1,
        },
        {
          label: '腾讯云',
          value: 2,
        },
      ],
    },
  },

  {
    component: 'Input',
    fieldName: 'name',
    label: '名称',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'accessKey',
    rules: 'required',
    label: 'Access Key',
  },
  {
    component: 'Input',
    fieldName: 'secretKey',
    label: 'Secret Key',
    rules: 'required',
  },
];
const columns: VxeGridPropTypes.Columns<DmDnsAccount> = [
  {
    field: 'dnsAccountId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'dnsType',
    title: '类型',
    formatter: ({ cellValue }) => {
      if (cellValue === 1) {
        return '阿里云';
      }
      return '腾讯云';
    },
  },
  {
    field: 'name',
    title: '名称',
  },
  {
    field: 'accessKey',
    title: 'Access Key',
  },
  {
    field: 'secretKey',
    title: 'Secret Key',
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
  } as VxeGridProps<DmDnsAccount>;
};
