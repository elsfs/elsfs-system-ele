<script lang="ts" setup>
import {defineEmits, defineExpose,nextTick,reactive,ref} from 'vue'

import {doDuplicateCheck} from "#/api/core/duplicateCheck";
import { useRequestHandle } from '#/api/devOps/sysConfig';
import { useMessage } from '#/hooks/message';
import {useDict} from "#/utils/dictUtils";
import {checkDate} from "#/views/devOps/config/config.data";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { configType } = useDict('configType');

const visible = ref(false)
// 定义变量内容
const dataFormRef = ref();
const loading = ref(false);

// 提交表单数据
const form = reactive({
  configId: '',
  configKey: '',
  configName: '',
  configValue: '',
  configType: 'S',
  remark: '',
});
// 定义校验规则
const dataRules = ref({
  configKey: [
    {required: true, message: '配置键不能为空', trigger: 'blur'},
    {
      validator: async  (_: any, configKey: any, callback: any) =>  {
        const { pass, message } = await doDuplicateCheck(
          checkDate(configKey, form.configId, 'config_key'),
        );
        if (!pass){
          callback(new Error(message));
        }
      },
      trigger: 'blur',
    },
  ],
  configName: [
    {required: true, message: '配置名称不能为空', trigger: 'blur'},
    {
      validator: async  (_: any, configName: any, callback: any) =>  {
        const { pass, message } = await doDuplicateCheck(
          checkDate(configName, form.configId, 'config_name'),
        );
        if (!pass){
          callback(new Error(message));
        }
      },
      trigger: 'blur',
    },
  ],
})
// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    await (form.configId
      ? useRequestHandle.edit(form)
      : useRequestHandle.add(form));
    useMessage().success(form.configId ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};
// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true;
  form.configId = '';
  nextTick(() => {
    dataFormRef.value.resetFields();
  });
  // 获取角色信息
  if (id) {
    form.configId = id;
    useRequestHandle.getById(id).then(
      (res) => {
        Object.assign(form, res);
      }
    )
  }
}
// 暴露变量
defineExpose({
  openDialog,
});
</script>

<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="visible"
    title="配置"
    width="600"
    draggable
    align-center
  >
    <el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
      <el-form-item label="配置KEY" prop="configKey">
        <el-input placeholder="请输入配置KEY" clearable v-model="form.configKey" />
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input placeholder="请输入配置名称" clearable v-model="form.configName" />
      </el-form-item>
      <el-form-item label="配置值" prop="configValue">
        <el-input placeholder="请输入配置值" clearable v-model="form.configValue" />
      </el-form-item>
      <el-form-item label="配置类型" prop="configType">
        <select v-model="form.configType">
          <option v-for="item in configType" :key="item.value" :value="item.value">{{ item.label }}</option>
        </select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input placeholder="请输入备注" type="textarea" clearable v-model="form.remark" />
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">取消</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">确定</el-button>
			</span>
    </template>
  </el-dialog>
</template>
