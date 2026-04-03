<script setup lang="ts">
import { ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useDict } from '#/utils/dictUtils';

import { gridOptionsContentCategory } from './article.data';

const emit = defineEmits(['select']);
const { cmsCategoryType } = useDict('cmsCategoryType');
const [Grid] = useVbenVxeGrid({
  formOptions: {
    // 默认展开
    collapsed: false,
    // 控制表单是否显示折叠按钮
    showCollapseButton: false,
    submitButtonOptions: {
      show: false,
    },
    // 是否在字段值改变时提交表单
    submitOnChange: true,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    resetButtonOptions: {
      show: false,
    },
    schema: [
      {
        component: 'Input',
        /**
         * 在Label后显示一个冒号
         */
        colon: true,
        componentProps: {
          placeholder: '请输入分类名称',
          clearable: true,
          style: {
            width: '240px',
          },
        },
        labelWidth: 70,
        fieldName: 'categoryName',
        label: '分类名称',
      },
    ],
  },
  gridOptions: gridOptionsContentCategory,
  showSearchForm: true,
});

/**
 * 计算label
 * @param type 类型
 */
function tagLabel(type: string) {
  const item = cmsCategoryType.value.find((item) => item.value === type);
  return item ? item.label : '未配置'; // 默认标签文本为 '未知类型'
}

/**
 * 计算标签类型
 * @param type 类型
 */
function tagType(type: string) {
  const item = cmsCategoryType.value.find((item) => item.value === type);
  return item ? item.type : '未配置'; // 默认标签文本为 '未知类型'}
}

/**
 *  选中
 * @param row
 */
function select(row: Record<String, any>) {
  emit('select', row);
}
</script>

<template>
  <Grid>
    <template #categoryName="{ row }">
      <div @click="select(row)">
        <span class="mr10">
          {{ row.categoryName }}
        </span>
        <ElTag :type="tagType(row.type)">
          {{ tagLabel(row.type) }}
        </ElTag>
      </div>
    </template>
  </Grid>
</template>

<style scoped></style>
