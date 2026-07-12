<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import { defineEmits, reactive, ref } from 'vue';

import { useRequestHandle } from '#/api/domain/dmIssueCertificate';

interface RuleForm {
  domainRaw: string;
  keyType: string;
  directoryType: string;
}
const emit = defineEmits<{
  cancel: [];
  success: [];
}>();
const formRef = ref<FormInstance>();
const formLabelAlign = reactive<RuleForm>({
  domainRaw: 'd.jglab-host.org.cn',
  keyType: 'ECC',
  directoryType: 'LE',
});

const rules = reactive<FormRules<RuleForm>>({
  domainRaw: [{ required: true, message: '请输入域名', trigger: 'blur' }],
  keyType: [{ required: true, message: '请选择加密方式', trigger: 'blur' }],
  directoryType: [
    { required: true, message: '请选择证书厂商', trigger: 'blur' },
  ],
});
const loading = ref(false);
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        loading.value = true;
        await useRequestHandle.add(formLabelAlign);
        emit('success');
      } finally {
        loading.value = false;
      }
    }
  });
};
const cancelForm = () => {
  emit('cancel');
};
</script>

<template>
  <el-form
    label-position="right"
    ref="formRef"
    :rules="rules"
    :model="formLabelAlign"
    style="max-width: 600px"
  >
    <el-form-item label="域 名" label-position="right" prop="domainRaw">
      <el-input v-model="formLabelAlign.domainRaw" placeholder="请输入域名" />
    </el-form-item>
    <el-form-item label="加密方式" prop="keyType">
      <el-radio-group
        v-model="formLabelAlign.keyType"
        size="large"
        fill="#409eff"
      >
        <el-radio-button label="ECC" value="ECC" />
        <el-radio-button label="RSA" value="RSA" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="证书厂商" prop="directoryType">
      <el-radio-group v-model="formLabelAlign.directoryType" size="large">
        <el-radio value="LE" border class="custom-radio-blue">
          <img src="/letsEncrypt.png" style="width: 100px" />
        </el-radio>
        <el-radio value="ZERO_SSL" border class="custom-radio-blue">
          <img src="/zerossl.png" style="width: 100px" />
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      申请域名为www.domain.com的证书同时支持保护domain.com
    </el-form-item>
    <el-form-item>
      <div class="flex w-full justify-center">
        <el-button type="default" @click="cancelForm()" :disabled="loading">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm(formRef)"
          :loading="loading"
        >
          确定
        </el-button>
      </div>
    </el-form-item>
  </el-form>
</template>
<style scoped>
.custom-radio-blue.is-checked {
  background-color: #3b82f6;
}
</style>
