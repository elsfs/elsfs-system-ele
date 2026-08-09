<script lang="ts" setup>
import { defineEmits, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { merge } from 'lodash';

import { useRequestHandle } from '#/api/developer/genTemplate';
import { useMessage } from '#/hooks/message';
import { rule } from '#/utils/validate';

defineOptions({
  name: 'GenTemplateModal',
});

const emits = defineEmits(['refresh']);

// 提交表单数据
const form = reactive({
  id: '',
  templateName: '',
  generatorPath: '',
  templateDesc: '',
  templateCode: '',
});
const isUpdate = ref(false);
const [Modal, modalApi] = useVbenModal({
  // 显示关闭按钮
  closable: true,
  class: 'w-[80%]',
  onCancel() {
    modalApi.close();
  },
  // 显示确认按钮文本
  showConfirmButton: false,
  // 显示取消按钮
  showCancelButton: false,
  onOpenChange,
});
async function handleSubmit() {
  isUpdate.value ? useRequestHandle.edit(form) : useRequestHandle.add(form);
  useMessage().success(isUpdate.value ? '修改成功' : '保存成功');
  await modalApi.close();
  emits('refresh');
}
function onOpenChange(isOpen: boolean) {
  if (isOpen) {
    const drawerData = modalApi.getData<Record<string, any>>();
    isUpdate.value = !!drawerData.isUpdate;
    // 重置表单数据
    form.id = '';
    form.generatorPath = '';
    form.templateCode = '';
    form.templateDesc = '';
    form.templateName = '';
    merge(form, drawerData.data);
  }
}

// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);
// 定义校验规则
const dataRules = ref({
  templateName: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: '模板名称不能为空', trigger: 'blur' },
  ],
  generatorPath: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: '模板路径不能为空', trigger: 'blur' },
  ],
  templateDesc: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: '模板描述不能为空', trigger: 'blur' },
  ],
});
</script>

<template>
  <Modal title="模版">
    <el-form
      :model="form"
      :rules="dataRules"
      form-dialog-ref
      ref="dataFormRef"
      v-loading="loading"
    >
      <el-row>
        <el-col :span="12" class="mb20">
          <el-form-item label="模版名称" prop="templateName">
            <el-input
              placeholder="请输入模板名称"
              v-model="form.templateName"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模板描述" prop="templateDesc">
            <el-input
              placeholder="请输入模板描述"
              type="textarea"
              v-model="form.templateDesc"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模版路径" prop="generatorPath">
            <el-input
              placeholder="请输入模版路径"
              v-model="form.generatorPath"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <CodeEditor
        v-model="form.templateCode"
        theme="darcula"
        mode="velocity"
        height="500"
      />
      <div class="dialog-footer">
        <ElButton @click="handleSubmit" type="primary" :disabled="loading">
          提交
        </ElButton>
      </div>
    </el-form>
  </Modal>
</template>

<style scoped>
/* 样式代码 */
</style>
