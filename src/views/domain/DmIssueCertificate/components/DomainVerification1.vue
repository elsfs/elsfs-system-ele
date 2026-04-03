<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus';

import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { reactive, ref } from 'vue';

import { Download, MostlyCloudy } from '@element-plus/icons-vue';
import { ElForm } from 'element-plus';

import { verifyCertificate } from '#/api/domain/dmIssueCertificate';
import { useMessage } from '#/hooks';

// 模拟数据
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
// 表单实例
const ruleFormRef = ref<FormInstance>();
// 预览证书数据
const dmIssueCertificate = ref<DmIssueCertificate>();
// 表单数据
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
  ],
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
</script>
<template>
  <div style="float: right">
    <span style="color: red">！</span>验证通过后会自动加入到[证书监控]列表
  </div>
  <el-menu mode="horizontal" default-active="file">
    <el-menu-item index="file"> 文件验证 </el-menu-item>
    <el-menu-item index="dns">DNS验证</el-menu-item>
  </el-menu>
  <el-table
    :data="tableData"
    class="mt-5"
    stripe
    border
    max-height="150"
    style="width: 100%"
  >
    <el-table-column prop="date" label="域名" width="180" />
    <el-table-column prop="name" label="验证状态" width="180">
      <template #default="{ row }">
        <el-icon><MostlyCloudy /></el-icon>
        {{ row.name }}
      </template>
    </el-table-column>
    <el-table-column prop="address" label="验证URL" />
    <el-table-column prop="address1" label="验证文件" />
  </el-table>
  <ElForm
    ref="ruleFormRef"
    class="mt-10"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
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

    <div class="form-buttons-right">
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        一键部署并验证
      </el-button>
    </div>
  </ElForm>
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
