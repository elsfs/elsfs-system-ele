<script setup lang="ts">
import { useVbenVxeGrid } from '@vben/plugins/vxe-table';

import { ElButton } from 'element-plus';
import { Pane, Splitpanes } from 'splitpanes';

import { useRequestHandle } from '#/api/cms/article';
import { router } from '#/router';

import { columns, searchSchemaFrom } from './article.data';
import ContentCategoryTable from './ContentCategoryTable.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    // 控制表单是否显示折叠按钮
    showCollapseButton: true,
    // 是否在字段值改变时提交表单
    submitOnChange: true,
    // 按下回车时是否提交表单
    submitOnEnter: true,
    resetButtonOptions: {
      show: false,
    },
    schema: searchSchemaFrom,
  },
  gridOptions: {
    columns,
    proxyConfig: {
      enabled: true,
      ajax: {
        query: (_, formValues) => {
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
  },
  showSearchForm: true,
});
/**
 * 点击刷新表格
 */
const refresh = (contentCategory) => {
  gridApi.reload({
    categoryId: contentCategory.categoryId,
  });
};
function openModel(articleId: string) {
  if (articleId) {
    // 跳转到 /
    router.push({
      name: '编辑文章',
      path: '/cms/article/ArticleModel',
      query: { articleId },
    });
    return;
  }
  router.push({
    name: '编辑文章',
    path: '/cms/article/ArticleModel',
  });
}
</script>
<template>
  <Splitpanes>
    <Pane class="ml10">
      <Splitpanes>
        <Pane size="30">
          <ContentCategoryTable @select="refresh" />
        </Pane>
        <Pane class="ml8">
          <Grid>
            <template #toolbar-actions>
              <ElButton class="mr-1" type="primary" @click="openModel(null)">
                新增
              </ElButton>
            </template>
            <template #action="{ row }">
              <ElButton text type="primary" @click="openModel(row.articleId)">
                编辑
              </ElButton>
            </template>
          </Grid>
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
<style scoped></style>
