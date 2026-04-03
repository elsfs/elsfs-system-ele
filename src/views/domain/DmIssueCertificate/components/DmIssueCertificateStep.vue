<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
  active: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="flex flex-col">
    <el-steps style="max-width: 600px" :active="active" finish-status="success">
      <el-step title="填写域名" />
      <el-step title="验证域名" />
      <el-step title="部署证书" />
    </el-steps>
  </div>
</template>
