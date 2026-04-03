import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { SysPost } from '#/api/system/sysPost';

import { z } from '#/adapter/form';
import { doDuplicateCheckDebounced } from '#/api/core/duplicateCheck';
import { schemaName } from '#/api/schemaName';
import { useRequestHandle } from '#/api/system/sysPost';
import { useDict } from '#/utils/dictUtils';

const { status, postRank } = useDict('postRank', 'status');
function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'sys_post', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'post_id', // 主键名称
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
        placeholder: '请输入职务名称',
        clearable: true,
      },
      fieldName: 'postName',
      label: '职务名称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入职务编码',
        clearable: true,
      },
      fieldName: 'postCode',
      label: '职务编码',
    },
    {
      component: 'Select',
      fieldName: 'postRank',
      label: '职级',
      componentProps: {
        clearable: true,
        placeholder: '请选择',
        options: postRank,
      },
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
    label: 'postId',
    fieldName: 'postId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['postId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'postName',
    label: '职务名称',
    dependencies: {
      async rules(values) {
        const { postName, postId } = values;
        if (!postName) {
          return 'required';
        }
        return z
          .string()
          .min(2, '职务名称长度不能小于2')
          .max(6, '职务名称长度不能大于6')
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(postName, postId, 'post_name'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['postName'],
    },
  },
  {
    component: 'Input',
    fieldName: 'postCode',
    label: '职务编码',
    dependencies: {
      async rules(values) {
        const { postCode, postId } = values;
        if (!postCode) {
          return 'required';
        }
        return z
          .string()
          .min(1, '职务编码长度不能小于1')
          .max(32, '职务编码不能大于32')
          .superRefine(async (_, ctx) => {
            const { pass, message } = await doDuplicateCheckDebounced(
              checkDate(postCode, postId, 'post_code'),
            );
            if (!pass) {
              ctx.addIssue({
                message,
                code: z.ZodIssueCode.custom, // 自定义错误类型
              });
            }
          });
      },
      triggerFields: ['postCode'],
    },
  },
  {
    component: 'Select',
    fieldName: 'postRank',
    label: '职级',
    rules: 'required',
    defaultValue: '1',
    componentProps: {
      options: postRank,
    },
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
const columns: VxeGridPropTypes.Columns<SysPost> = [
  {
    field: 'postId',
    align: 'left',
    type: 'checkbox',
    width: 50,
  },
  { field: 'postName', title: '职务名称' },
  { field: 'postCode', title: '职务编码' },
  {
    field: 'postRank',
    title: '职级',
    cellRender: { name: 'Dict', props: { dict: 'postRank' } },
  },
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
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async (_, formValues) => {
          if (isRecycle) {
            return useRequestHandle.logicList({
              ...formValues,
            });
          }
          return useRequestHandle.list({
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
  } as VxeGridProps<SysPost>;
};
