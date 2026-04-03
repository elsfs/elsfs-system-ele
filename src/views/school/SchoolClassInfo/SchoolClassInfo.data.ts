import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { RowType } from '#/views/cms/contentCategory/contentCategory.data';

import { useRequestHandle } from '#/api/school/SchoolClassInfo';
import { useDict } from '#/utils/dictUtils';

const { classStatus } = useDict('classStatus');
export interface SchoolClassInfo {
  // 班级id
  classGradesId: string;
  // 班级名称
  name: string;
  // 班名称
  className: string;
  // 年级名称
  gradesName: string;
  // 届次
  session: string;
  // 班主任id
  classTeacherId: string;
  // 班主任姓名
  classTeacherName: string;
  // 班级状态  班级状态 0 未开始 1 进行中 -1 结束
  classStatus: string;
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
        placeholder: '请输入年级名称',
      },
      fieldName: 'gradesName',
      label: '年级名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择',
        clearable: true,
        options: [
          { label: '未开始', value: '0' },
          { label: '进行中', value: '1' },
          { label: '结束', value: '-1' },
        ],
      },
      fieldName: 'classStatus',
      label: '班级状态',
    },
  ],
};
const columns: VxeGridPropTypes.Columns<RowType> = [
  { type: 'checkbox', width: 50 },
  { field: 'name', title: '班级名称' },
  { field: 'gradesName', title: '年级名称' },
  { field: 'className', title: '班名称' },
  { field: 'session', title: '届次' },
  { field: 'classTeacherName', title: '班主任姓名' },
  {
    field: 'classStatus',
    title: '班级状态',
    cellRender: { name: 'Dict', props: { dict: 'classStatus' } },
  },
  { title: '操作', fixed: 'right', width: 200, slots: { default: 'action' } },
];
export const gridOptions: VxeGridProps.VxeGridProps<RowType> = {
  columns,
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      query: ({ page }, formValues) => {
        return useRequestHandle.page(formValues);
      },
    },
  },
  exportConfig: {},

  toolbarConfig: {
    // 是否显示搜索表单控制按钮
    // @ts-ignore 正式环境时有完整的类型声明
    search: true,
    custom: true,
    export: true,
    // import: true,
    refresh: true,
    zoom: true,
  },
};

export const schemaFrom: VbenFormSchema[] = [
  {
    component: 'Input',
    componentProps: {
      placeholder: '请输入班级名称',
    },
    rules: 'required',
    dependencies: {
      disabled: true,
    },
    fieldName: 'name',
    label: '班级名称',
  },
  {
    rules: 'required',
    component: 'Input',
    componentProps: {
      placeholder: '请输入班名称',
    },
    fieldName: 'className',
    label: '班名称',
  },
  {
    rules: 'required',
    component: 'Input',
    componentProps: {
      placeholder: '请输入年级名称',
    },
    fieldName: 'gradesName',
    label: '年级名称',
  },
  {
    rules: 'required',
    component: 'Input',
    componentProps: {
      placeholder: '请输入届次',
    },
    fieldName: 'session',
    label: '届次',
  },
  {
    rules: 'required',
    component: 'Select',
    defaultValue: '0',
    componentProps: {
      allowClear: true,
      placeholder: '请选择',
      options: classStatus,
    },
    fieldName: 'classStatus',
    label: '班级状态',
  },
  {
    rules: 'required',

    component: 'Input',
    componentProps: {
      placeholder: '请输入班主任',
    },
    fieldName: 'classTeacherId',
    label: '班主任',
  },

  {
    rules: 'required',

    component: 'Input',
    fieldName: 'classTeacherName',
    label: '班主任姓名',
    componentProps: {
      type: 'hidden',
    },
    dependencies: {
      if: false,
    },
    hideLabel: true,
  },
  {
    rules: 'required',
    component: 'Input',
    componentProps: {
      type: 'hidden',
    },
    dependencies: {
      if: false,
    },
    hideLabel: true,
    fieldName: 'classGradesId',
    label: '班级id',
  },
];
