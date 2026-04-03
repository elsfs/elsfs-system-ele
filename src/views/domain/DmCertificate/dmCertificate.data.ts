import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { DmCertificate } from '#/api/domain/dmCertificate';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
  parseCertificateToJson,
  useRequestHandle,
} from '#/api/domain/dmCertificate';
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
    label: 'certificateId',
    fieldName: 'certificateId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['certificateId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'domain',
    label: '域名',
    rules: 'required',
  },

  {
    component: 'Input',
    fieldName: 'sslCertificate',
    label: '证书',
    rules: 'required',
    componentProps: {
      placeholder: '证书内容（.pem文件）',
      rows: 6,
      type: 'textarea',
    },
    dependencies: {
      triggerFields: ['sslCertificate'],
      componentProps(value: DmCertificate, _) {
        return {
          onBlur: async (e) => {
            if (value.sslCertificate) {
              const json = await parseCertificateToJson(value.sslCertificate);
              if (json && json.subject) {
                value.domain = json.subject.CN;
              }
              value.startTime = dayjs(json.notBefore).format(
                'YYYY-MM-DD HH:mm:ss',
              );
              value.expireTime = dayjs(json.notAfter).format(
                'YYYY-MM-DD HH:mm:ss',
              );
            }
          },
        };
      },
    },
  },
  {
    component: 'Input',
    fieldName: 'sslCertificateKey',
    label: '证书私钥',
    componentProps: {
      placeholder: '证书内容（.key文件）',
      rows: 6,
      type: 'textarea',
    },
  },
  {
    component: 'DatePicker',
    fieldName: 'startTime',
    label: '签发时间',
    componentProps: {
      placeholder: '请选择签发时间',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      type: 'date',
    },
  },
  {
    component: 'DatePicker',
    fieldName: 'expireTime',
    label: '过期时间',
    componentProps: {
      placeholder: '请选择过期时间',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      type: 'date',
    },
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
const columns: VxeGridPropTypes.Columns<DmCertificate> = [
  {
    field: 'certificateId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  {
    field: 'domain',
    title: '域名',
    slots: { default: 'domain' },
  },
  {
    field: 'sslCertificateDay',
    title: '证书天数',
    slots: { default: 'sslCertificateDay' },
  },
  {
    field: 'startTime',
    title: '签发时间',
  },
  {
    field: 'expireTime',
    title: '过期时间',
  },
  {
    field: 'remark',
    title: '备注',
  },
  {
    field: 'createAt',
    title: '创建时间',
  },
  {
    field: 'SSH部署',
    title: 'SSH部署',
  },
  {
    field: 'API部署',
    title: 'API部署',
  },
  {
    field: '证书',
    title: '证书',
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
  } as VxeGridProps<DmCertificate>;
};
