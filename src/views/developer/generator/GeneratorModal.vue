<script lang="ts" setup>
import type { ExtendedVxeGridApi } from '@vben/plugins/src/vxe-table/types';

import { defineAsyncComponent, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import {
  ElButton,
  ElCard,
  ElMessage,
  ElStep,
  ElSteps,
  ElSwitch,
} from 'element-plus';
import { merge } from 'lodash';

import { useVbenForm } from '#/adapter/form';
import { preview } from '#/api/developer/generator';
import { useRequestHandle as useGroupRequestHandle } from '#/api/developer/genGroup';
import { tableColumnList } from '#/api/developer/table';
import { useRequestHandle as useMenuRequestHandle } from '#/api/system/menu';
import { tableColumnGridOptions as gridOptions } from '#/views/developer/table/table.data';

const Preview = defineAsyncComponent(() => import('./Preview.vue'));

const [FirstForm, firstFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-[auto]',
    },
    labelClass: 'w-[auto]',
  },
  handleSubmit: onFirstSubmit,
  layout: 'horizontal',

  resetButtonOptions: {
    show: false,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        // 禁止输入
        disabled: true,
      },
      fieldName: 'tableName',
      label: '表名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'className',
      label: '类名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'packageName',
      defaultValue: 'org.elsfs.cloud',
      label: '项目包名',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'functionName',
      help: '对应生成的Controller @RequestMapping 请求路径',
      label: '功能名',
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      fieldName: 'menuId',
      help: '生成的 【xx管理】菜单挂载在哪个目录下',
      label: '所属菜单',
      rules: 'required',
      defaultValue: '0',
      componentProps: {
        placeholder: '请选择',
        // 从后端获取菜单信息
        api: async () => {
          const parentData = [];
          const dept = {
            menuId: '0',
            menuName: '根部门',
            children: [] as any[],
          };
          dept.children = await useMenuRequestHandle.tree();
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
      fieldName: 'tableComment',
      label: '注释',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'author',
      label: '作者',
      defaultValue: 'zeng',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'moduleName',
      help: '所属微服务模块名称',
      label: '模块名',
      defaultValue: 'admin',
      rules: 'required',
    },

    {
      component: 'ApiTreeSelect',
      fieldName: 'groupId',
      label: '代码风格',
      rules: 'required',
      componentProps: {
        placeholder: '请选择',
        // 从后端获取菜单信息
        api: useGroupRequestHandle.list,
        childrenField: 'children',
        // 菜单接口转options格式
        labelField: 'groupName',
        valueField: 'id',
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'syncMenu',
      defaultValue: '0',
      help: '待实现',
      label: '同步路由',
      rules: 'required',
      componentProps: {
        options: [
          {
            label: '手动添加',
            value: '0',
          },
          {
            label: '自动添加',
            value: '1',
          },
        ],
      },
    },
    {
      component: 'RadioGroup',
      fieldName: 'generatorType',
      defaultValue: '1',
      help: '待实现',
      label: '生成方式',
      rules: 'required',
      componentProps: {
        options: [
          {
            label: '自定义路径',
            value: '0',
          },
          {
            label: 'ZIP压缩包',
            value: '1',
          },
        ],
      },
    },
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  // 大屏一行显示2个，中屏一行显示1个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2',
});
const previewRef = ref();
const [Modal, modalApi] = useVbenModal({
  class: 'w-[80%] h-[80%]',
  // 显示关闭按钮
  closable: true,
  onCancel() {
    modalApi.close();
  },
  // 显示确认按钮文本
  showConfirmButton: false,
  // 显示取消按钮
  showCancelButton: false,
  onOpenChange,
});

function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    drawerData.data.functionName = toBigCamelCase(
      drawerData.data.tableName,
      false,
    );
    drawerData.data.className = toBigCamelCase(drawerData.data.tableName, true);
    data.value = drawerData.data;
    firstFormApi.setValues(drawerData.data);
    activeName.value = 'field';
  }
}
/**
 * 转驼峰命名
 * @param str 字符串
 * @param initialCapitalization 是否首字母大写
 */
function toBigCamelCase(str: string, initialCapitalization: boolean): string {
  if (!str) return '';

  const WORD_SEPARATOR_REGEX = /[^a-z0-9]+/gi; // 匹配连续的非字母数字字符
  const words = str.toLowerCase().split(WORD_SEPARATOR_REGEX).filter(Boolean);

  if (words.length === 0) return '';

  const camelCase = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // 根据 initialCapitalization 决定是否首字母小写
  return initialCapitalization
    ? camelCase
    : camelCase.charAt(0).toLowerCase() + camelCase.slice(1);
}
const baseInfo = ref();
const currentTab = ref(0);
function onFirstSubmit(values: Record<string, any>) {
  baseInfo.value = values;
  currentTab.value = 1;
}
function onSecondReset() {
  currentTab.value = 0;
}
function onSecondSubmit(values: Record<string, any>) {
  ElMessage.success({
    content: `form2 values: ${JSON.stringify(values)}`,
  });
}

const [SecondForm, secondFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onSecondReset,
  handleSubmit: onSecondSubmit,
  layout: 'horizontal',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'formSecond',
      label: '表单2字段',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-1 lg:grid-cols-1',
});
const needMerge = ref(true);
async function handleMergeSubmit() {
  const values = await firstFormApi
    .merge(secondFormApi)
    .submitAllForm(needMerge.value);
  ElMessage.success({
    content: `merged form values: ${JSON.stringify(values)}`,
  });
}
const activeName = ref();
const data = ref();
async function previewCode() {
  const params = {};
  merge(params, baseInfo.value);
  merge(params, data.value);
  params.fieldList = gridApi.grid.getData();
  const code = await preview(params);

  previewRef.value.openDialog(code);
}
const [Grid, gridApi]: [any, ExtendedVxeGridApi] = useVbenVxeGrid({
  gridOptions: {
    ...gridOptions,
    toolbarConfig: {},
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      enabled: true,
      autoLoad: true,
      ajax: {
        query: async () => {
          return tableColumnList(data.value.dsName, data.value.tableName);
        },
      },
    },
  },
  showSearchForm: true,
});
</script>

<template>
  <div>
    <Modal>
      <Page description="代码生成配置" title="代码生成">
        <ElCard title="基础示例">
          <template #extra>
            <ElSwitch
              v-model:checked="needMerge"
              checked-children="开启字段合并"
              class="mr-4"
              un-checked-children="关闭字段合并"
            />
            <ElButton type="primary" @click="handleMergeSubmit">
              合并提交
            </ElButton>
          </template>
          <div>
            <ElSteps :current="currentTab" class="ElSteps mx-auto max-w-lg">
              <ElStep title="基础信息" />
              <ElStep title="数据修改" />
            </ElSteps>
            <div class="bg-blue-50">
              <FirstForm v-show="currentTab === 0" />

              <div v-show="currentTab === 1">
                <el-tabs v-model="activeName">
                  <!-- 属性设置面板 -->
                  <el-tab-pane label="属性" name="field">
                    <Grid />
                  </el-tab-pane>
                  <el-tab-pane label="列表查询" name="third" />
                  <el-tab-pane label="表单页面" name="form" />
                </el-tabs>

                <div class="bg-emerald-300 text-center">
                  <ElButton type="primary" @click="onSecondReset">
                    上一步
                  </ElButton>
                  <ElButton type="primary" @click="previewCode">
                    保存并预览
                  </ElButton>
                  <ElButton type="primary" @click="onSecondReset">
                    保存并生成
                  </ElButton>
                </div>
              </div>
            </div>
          </div>
        </ElCard>
      </Page>
    </Modal>
    <Preview ref="previewRef" />
  </div>
</template>
