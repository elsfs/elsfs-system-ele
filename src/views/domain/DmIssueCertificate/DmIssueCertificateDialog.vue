<script lang="ts" name="DmIssueCertificateDialog" setup>
import type { DmIssueCertificate } from '#/api/domain/dmIssueCertificate';

import { defineExpose, nextTick, ref } from 'vue';

import Add from './components/Add.vue';
import DmIssueCertificateStep from './components/DmIssueCertificateStep.vue';
import DomainVerification from './components/DomainVerification1.vue';
// 是否显示
const visible = ref(false);
// 步骤
const active = ref(0);
const openDialog = (row: DmIssueCertificate | null) => {
  visible.value = true;
  if (row === null) {
    // 重置表单数据
    nextTick(() => {});
    active.value = 0;
  }
  if (row?.validationStatus === '1') {
    active.value = 1;
    nextTick(() => {});
  }
  if (row?.validationStatus === '2') {
    active.value = 2;
    nextTick(() => {});
  }
};
// 暴露变量
defineExpose({
  openDialog,
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="申请SSL证书"
    width="800"
    center
    destroy-on-close
  >
    <!-- 头部 -->
    <template #header>
      <h1
        class="content mb-8 w-full items-center text-center text-2xl font-bold"
      >
        申请SSL证书
      </h1>
    </template>
    <!-- 步骤条 -->
    <div class="mx-auto max-w-lg">
      <DmIssueCertificateStep :active="active" />
    </div>
    <div class="mt-10">
      <!--  第一步 申请   -->
      <div class="mx-auto max-w-2xl" v-if="active === 0">
        <Add @cancel="visible = false" />
      </div>
      <div>
        <DomainVerification />
      </div>
    </div>
  </el-dialog>
</template>
