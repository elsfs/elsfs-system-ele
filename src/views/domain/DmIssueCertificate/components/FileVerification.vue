<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';

import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Download } from '@element-plus/icons-vue';
import { ElForm } from 'element-plus';

import {
  getCertificateChallenges,
  verifyCertificate,
} from '#/api/domain/dmIssueCertificate';
import { useMessage } from '#/hooks';

defineOptions({
  name: 'FileVerification',
});
function nginxConfigTemplate(domain: string, serverDirectory: string) {
  return `server {
  listen 80;
  server_name ${domain};

  location /.well-known/acme-challenge/ {
      alias ${serverDirectory};
      try_files $uri = 404;
  }
}
  `;
}
const dmIssueCertificate = ref<DmIssueCertificate>();
const ruleFormRef = ref<FormInstance>();
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'));
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPass');
    }
    callback();
  }
};

const ruleForm = reactive({
  domainRaw: '',
  verificationStatus: '',
  verificationUrl: '',
  validation: '',
  token: '', // 验证文件token
  serverAddress: '',
  serverDirectory: '/var/www/challenges/',
  nginxConfig: '',
});
const rules = reactive<FormRules<typeof ruleForm>>({
  domainRaw: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' },
  ],
  checkPass: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return;
            ruleFormRef.value.validateField('checkPass');
          }
          callback();
        }
      },
      trigger: 'blur',
    },
  ],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (ruleForm.verificationStatus !== 'PENDING') {
    useMessage().successMessage('已验证无需再次验证');
    return;
  }
  verifyCertificate({
    issueCertificateId: dmIssueCertificate.value.issueCertificateId,
    challengeType: 'http-01',
  });
};
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const [Modal, modalApi] = useVbenModal({
  // 显示关闭按钮
  closable: true,
  async onOpenChange(isOpen) {
    if (!isOpen) {
      return;
    }
    try {
      modalApi.lock();
      dmIssueCertificate.value = modalApi.getData().data;
      const certificateChallenges = await getCertificateChallenges(
        dmIssueCertificate.value.issueCertificateId,
      );
      const htt01 = certificateChallenges.find(
        (item) => item.type === 'http-01',
      );
      if (!htt01) {
        return;
      }
      ruleForm.domainRaw = htt01.domain;
      const status = htt01.challengeEntity.status;
      ruleForm.verificationStatus =
        status === 'PENDING' ? '待处理' : '处理完成';
      // http:// 子域名 /.well-known/acme-challenge/ 生成token
      ruleForm.verificationUrl = `http://${htt01.domain}/.well-known/acme-challenge/${htt01.challengeEntity.token}`; // 验证URL
      ruleForm.validation = htt01.validation;
      ruleForm.token = htt01?.challengeEntity.token;
      ruleForm.nginxConfig = nginxConfigTemplate(
        ruleForm.domainRaw,
        ruleForm.serverDirectory,
      );
      console.log(htt01);
    } finally {
      modalApi.unlock();
    }
  },
  showConfirmButton: true,
  confirmText: '验证',
  showCancelButton: true,
  onConfirm() {
    submitForm(ruleFormRef.value);
  },
});

/**
 * 下载验证文件
 */
function downloadVerificationFile() {
  // 下载验证文件
  // 创建 Blob 对象
  const blob = new Blob([ruleForm.validation], {
    type: 'application/octet-stream',
  });
  // 创建下载链接
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  // 设置下载属性
  link.href = url;
  link.download = ruleForm.token;
  // 触发下载
  document.body.append(link);
  link.click();
  // 清理
  link.remove();
  URL.revokeObjectURL(url);
}
</script>

<template>
  <Modal>
    <ElForm
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="域名" prop="domainRaw">
        <el-input
          disabled
          v-model="ruleForm.domainRaw"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="验证状态" prop="verificationStatus">
        <el-input
          disabled
          v-model="ruleForm.verificationStatus"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="验证URL" prop="verificationUrl">
        <a
          :href="ruleForm.verificationUrl"
          target="_blank"
          class="verification-link"
        >
          {{ ruleForm.verificationUrl }}
        </a>
      </el-form-item>
      <el-form-item label="验证文件" prop="validation">
        <span class="download-button" @click="downloadVerificationFile">
          <el-icon>
            <Download />
          </el-icon>
          <span>下载</span>
        </span>
      </el-form-item>
      <el-form-item label="服务器地址" prop="serverAddress">
        <el-input
          v-model="ruleForm.serverAddress"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="服务器目录" prop="serverDirectory">
        <el-input
          v-model="ruleForm.serverDirectory"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="Nginx配置" prop="nginxConfig">
        <el-input
          autosize
          v-model="ruleForm.nginxConfig"
          type="textarea"
          autocomplete="off"
        />
      </el-form-item>
    </ElForm>
    <template #append-footer>
      <div class="form-buttons-right">
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          一键部署并验证
        </el-button>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
.form-buttons-right {
  display: flex;
  justify-content: flex-end;
}

.download-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 6px 12px;
  color: #0a00c2;
  cursor: pointer;
  background-color: transparent;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.download-button:hover {
  color: #409eff;
  background-color: #ecf5ff; /* 浅蓝色背景 */
}

.download-button:active {
  transform: scale(0.98); /* 点击按下效果 */
}

.verification-link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer; /* 手型 */
  transition: all 0.3s ease;
}

.verification-link:hover {
  color: #66b1ff;
  text-decoration: underline; /* 悬停时加下划线 */
}
</style>
