import type { VxeGridProps, VxeGridPropTypes } from 'vxe-table';

import type { VbenFormProps, VbenFormSchema } from '#/adapter/form';
import type { SysMenu } from '#/api/system/menu';

import dayjs from 'dayjs';

import { defaultComponentName, useRequestHandle } from '#/api/system/menu';
import { useDict } from '#/utils/dictUtils';

const { menuType, status } = useDict('menuType', 'status');

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
        clearable: true,
        placeholder: '请输入菜单名称',
      },
      fieldName: 'menuName',
      label: '菜单名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        clearable: true,
        placeholder: '请选择',
        options: menuType,
      },
      fieldName: 'type',
      label: '类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        clearable: true,
        placeholder: '请选择',
        options: status,
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      fieldName: 'isExt',
      label: '是否外链',
      component: 'Checkbox',
      defaultValue: false,
    },
  ],
};
const columns: VxeGridPropTypes.Columns<SysMenu> = [
  { type: 'checkbox', width: 70, align: 'left', fixed: 'left' },
  {
    field: 'menuName',
    width: 250,
    title: '菜单名称',
    treeNode: true,
    align: 'left',
    fixed: 'left',
    slots: { default: 'menuName' },
  },
  {
    field: 'type',
    title: '类型',
    width: 70,
    cellRender: { name: 'Dict', props: { dict: 'menuType' } },
  },
  { field: 'routePath', title: '访问路径', width: 150 },
  { field: 'component', title: '组件名称', width: 150 },
  { field: 'orderNo', title: '排序', width: 150 },
  {
    field: 'isExt',
    title: '外链',
    width: 70,
    formatter: ({ cellValue }) => {
      return cellValue === '0' ? '是' : '否';
    },
  },
  {
    field: 'isSHow',
    title: '显示',
    width: 70,
    formatter: ({ cellValue }) => {
      return cellValue === '0' ? '是' : '否';
    },
  },
  {
    field: 'status',
    title: '状态',
    width: 70,
    cellRender: { name: 'Dict', props: { dict: 'status' } },
  },
  {
    field: 'createAt',
    title: '创建时间',
    width: 150,
    formatter: ({ cellValue }): string => {
      return cellValue ? dayjs(cellValue).format('YYYY年MM月DD日') : '';
    },
  },
  { fixed: 'right', width: 220, slots: { default: 'action' }, title: '操作' },
];
/**
 * Configuration options for the grid component.
 * @template SysMenu - The type of data rows in the grid.
 * @type {VxeGridProps<SysMenu>}
 */
export const gridOptions: VxeGridProps<SysMenu> = {
  columns,
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    parentField: 'parentId',
    rowField: 'menuId',
  },
  proxyConfig: {
    enabled: true,
    autoLoad: true,
    ajax: {
      query: (_, formValues) => {
        return useRequestHandle.tree(formValues);
      },
    },
  },
  exportConfig: {},
  height: 'auto',
  keepSource: true,
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
const isButton = (type: string) => type === '2';
const isRoot = (type: string) => type === '0';
const isMenu = (type: string) => type === '1';

export const formSchema: VbenFormSchema[] = [
  {
    label: 'menuId',
    fieldName: 'menuId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['menuId'],
    },
  },
  {
    fieldName: 'type',
    label: '菜单类型',
    component: 'RadioGroup',
    defaultValue: '0',
    componentProps: (values, actions) => {
      if (
        values.component !== '' ||
        values.component !== defaultComponentName
      ) {
        return {
          isButton: true,
          options: menuType?.value,
        };
      }
      if (isButton(values.type)) {
        values.component = '';
      }
      if (isRoot(values.type)) {
        values.component = defaultComponentName;
      }
      if (isMenu(values.type)) {
        values.component = '';
      }
      actions.setValues(values);
      return {
        isButton: true,
        options: menuType?.value,
      };
    },
  },
  {
    component: 'ApiTreeSelect',
    fieldName: 'parentId',
    label: '上级菜单',
    rules: 'required',
    defaultValue: '0',
    componentProps: {
      placeholder: '请选择',
      // 从后端获取菜单信息
      api: async () => {
        const parentData = [];
        const dept = {
          menuId: '0',
          menuName: '根菜单',
          children: [] as any[],
        };
        dept.children = await useRequestHandle.tree();
        parentData.push(dept);
        return parentData;
      },
      childrenField: 'children',
      // 菜单接口转options格式
      labelField: 'menuName',
      valueField: 'menuId',
    },
  },
  {
    component: 'Input',
    fieldName: 'menuName',
    label: '菜单名称',
    rules: 'required',
  },
  {
    fieldName: 'routePath',
    label: '访问路径',
    component: 'Input',
    rules: 'required',
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: {
      placeholder: '请输入访问路径',
    },
  },
  {
    fieldName: 'component',
    label: '前端组件',
    component: 'Input',
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
      rules(value) {
        if (isButton(value.type)) {
          return null;
        }
        return 'required';
      },
    },
    componentProps: {
      placeholder: '请输入前端组件',
    },
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'RadioGroup',
    defaultValue: '0',
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: {
      options: status,
      isButton: true,
      optionType: 'button',
    },
  },
  {
    fieldName: 'icon',
    label: '菜单图标',
    component: 'IconPicker',
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: {
      placeholder: '等待实现',
    },
  },
  {
    fieldName: 'orderNo',
    label: '排序',
    component: 'InputNumber',
    defaultValue: 1,
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: {
      placeholder: '等待实现',
    },
  },
  {
    fieldName: 'isExt',
    label: '是否外链',
    component: 'Checkbox',
    defaultValue: false,
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: {
      placeholder: '等待实现',
    },
  },
  {
    fieldName: 'isShow',
    label: '是否显示',
    component: 'Checkbox',
    defaultValue: 0,
    dependencies: {
      show(values) {
        return !isButton(values.type);
      },
      triggerFields: ['type'],
    },
    componentProps: { placeholder: '等待实现' },
  },
];
