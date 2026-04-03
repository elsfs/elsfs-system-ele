<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useRequestHandle as articleHandle } from '#/api/cms/article';
import { useRequestHandle } from '#/api/cms/contentCategory';
import { Editor } from '#/components/index.ts';
import UploadImage from '#/components/Upload/UploadImage.vue';
import { useMessage } from '#/hooks/message';

const route = useRoute();
const dataFormRef = ref<FormInstance>();
const articleId = ref();
// 侦听路由的参数，以便再次获取数据
watch(
  () => route.query.articleId,
  (newVal) => {
    articleId.value = newVal;
  },
  { immediate: true },
);
const form = reactive({
  articleId: '',
  title: '',
  coverImage: '',
  categoryId: '',
  summary: '',
  content: '',
});
const contentCategory = ref([]);

async function submitForm() {
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;
  await articleHandle.edit(form);
  useMessage().success('成功修改');
  getData();
}
async function getData() {
  // 重置表单数据
  await nextTick(() => {
    dataFormRef.value?.resetFields();
  });
  if (articleId.value) {
    const res = await articleHandle.getById(articleId.value);
    Object.assign(form, res);
  }
}
onMounted(async () => {
  getData();
  contentCategory.value = await useRequestHandle.tree();
});
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  coverImage: [{ required: true, message: '请上传封面', trigger: 'blur' }],
  categoryId: [
    { required: true, message: '请选择文章分类', trigger: 'change' },
  ],
  summary: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
});
</script>

<template>
  <div class="p-4">
    <el-form ref="dataFormRef" :model="form" :rules="rules" class="form-inline">
      <el-row :gutter="40">
        <el-col :span="20" class="mb20">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
        <el-col :span="20" class="mb20">
          <el-form-item label="封面" prop="coverImage">
            <UploadImage v-model:image-url="form.coverImage" />
          </el-form-item>
        </el-col>
        <el-col :span="20" class="mb20">
          <el-form-item label="文章分类" prop="categoryId">
            <el-tree-select
              v-model="form.categoryId"
              :data="contentCategory"
              :props="{
                value: 'categoryId',
                label: 'categoryName',
                children: 'children',
              }"
              check-strictly
              filterable
            />
          </el-form-item>
        </el-col>
        <el-col :span="20" class="mb20">
          <el-form-item label="摘要" prop="summary">
            <el-input
              v-model="form.summary"
              :rows="3"
              placeholder="请输入摘要"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="20" class="mb20">
          <el-form-item label="内容" prop="content">
            <Editor v-model:get-html="form.content" />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item>
            <el-button type="primary" @click="submitForm(dataFormRef)">
              提交
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<style scoped>
.form-inline .el-input {
  --el-input-width: 220px;
}

.form-inline .UploadImage {
  --el-input-width: 220px;
}

.form-inline .el-select {
  --el-select-width: 220px;
}
</style>
