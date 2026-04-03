import type { VbenFormSchema } from '#/adapter/form';
import type { DuplicateCheckQry } from '#/api/core/duplicateCheck';
import type { FormItem } from '#/components/from/types';

import { z } from '#/adapter/form';
import { useRequestDept } from '#/api/core/api';
import { doDuplicateCheck } from '#/api/core/duplicateCheck';
import { schemaName } from '#/api/schemaName';
import { useDict } from '#/utils/dictUtils';

const { status } = useDict('status');
const { useRequestHandle } = useRequestDept;
function checkDate(
  fieldVal: string,
  dataId: string,
  fieldName: string,
): DuplicateCheckQry {
  return {
    schemaName: schemaName.system, // 数据库名
    tableName: 'sys_dept', // 表名
    fieldName, // 字段名
    fieldVal, // 字段值
    dataId, // 数据ID
    keyName: 'dept_id', // 主键名称
  };
}
export interface DeptInfo {
  deptId: number;
  deptName: string;
  parentId: number;
  orderNo: number;
  createAt: string;
  updateAt: string;
}
export const formSchema: VbenFormSchema[] = [
  {
    label: 'postId',
    fieldName: 'deptId',
    component: 'Input',
    dependencies: {
      show: false,
      triggerFields: ['postId'],
    },
  },
  {
    component: 'Input',
    fieldName: 'deptName',
    label: '部门名称',
    dependencies: {
      async rules(values) {
        const { deptName, deptId } = values;
        if (!deptName) {
          return z.string().min(1, { message: '部门名称不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(deptName, deptId, 'dept_name'),
        );
        return z
          .string()
          .min(1, '部门名称长度不能小于1')
          .max(32, '部门名称长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['deptName'],
    },
  },
  {
    component: 'ApiTreeSelect',
    fieldName: 'parentId',
    rules: 'required',
    defaultValue: '0',
    label: '上级菜单',
    formItemClass: 'w-[500]px',
    // 对应组件的参数
    componentProps: {
      childrenField: 'children',
      // 菜单接口转options格式
      labelField: 'deptName',
      valueField: 'deptId',
      placeholder: '请输入父级字典项',

      api: async () => {
        const parentData = [];
        const ext = {
          deptId: '0',
          deptName: '根节点',
          children: [] as any[],
        };
        ext.children = await useRequestHandle.tree();
        parentData.push(ext);
        return parentData;
      },
    },
  },
  {
    fieldName: 'orgCode',
    component: 'Input',
    label: '部门编码',
    dependencies: {
      async rules(values) {
        const { orgCode, deptId } = values;
        if (!orgCode) {
          return z.string().min(1, { message: '部门编码不能为空' });
        }
        const { pass, message } = await doDuplicateCheck(
          checkDate(orgCode, deptId, 'dept_name'),
        );
        return z
          .string()
          .min(1, '部门编码长度不能小于1')
          .max(32, '部门编码长度不能大于6')
          .refine(() => pass, {
            message,
          });
      },
      triggerFields: ['orgCode'],
    },
  },
  {
    fieldName: 'deptDesc',
    component: 'Input',
    label: '部门描述',
  },
  {
    fieldName: 'orgCategory',
    component: 'Input',
    label: '部门类型',
  },
  {
    fieldName: 'status',
    label: '状态',
    component: 'RadioGroup',
    rules: 'required',
    defaultValue: '0',
    componentProps: {
      options: status,
    },
  },
  {
    fieldName: 'orderNo',
    component: 'InputNumber',
    label: '排序',
    rules: 'required',
    defaultValue: 9999,
  },
];
export const searchConfig: FormItem[] = [
  {
    prop: 'deptName',
    label: '部门名称',
    component: 'el-input',
    componentProps: {
      placeholder: '请输入部门名称',
      clearable: true,
      style: {
        maxWidth: '180px',
      },
    },
  },
];
