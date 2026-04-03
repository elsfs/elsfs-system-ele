<script setup lang="ts">
import { ref } from 'vue';

import { ElMessage } from 'element-plus';

const configForm = ref({
  layout: 'default',
  primaryColor: '#409EFF',
  components: ['header', 'sidebar'],
  responsive: true,
  contentWidth: 1200,
});

const saveConfig = () => {
  // TODO: 实现配置保存逻辑
  ElMessage.success('配置保存成功');
};

const resetConfig = () => {
  configForm.value = {
    layout: 'default',
    primaryColor: '#409EFF',
    components: ['header', 'sidebar'],
    responsive: true,
    contentWidth: 1200,
  };
  ElMessage.info('配置已重置');
};
</script>

<template>
  <div class="home-config-container">
    <el-card class="config-card">
      <template #header>
        <div class="card-header">
          <span>首页配置</span>
        </div>
      </template>

      <el-form :model="configForm" label-width="120px">
        <!-- 布局配置 -->
        <el-form-item label="布局方式">
          <el-radio-group v-model="configForm.layout">
            <el-radio label="default">默认布局</el-radio>
            <el-radio label="custom">自定义布局</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 主题配置 -->
        <el-form-item label="主题色">
          <el-color-picker v-model="configForm.primaryColor" />
        </el-form-item>

        <!-- 组件显示配置 -->
        <el-form-item label="显示组件">
          <el-checkbox-group v-model="configForm.components">
            <el-checkbox label="header">顶部导航栏</el-checkbox>
            <el-checkbox label="sidebar">侧边菜单栏</el-checkbox>
            <el-checkbox label="footer">底部信息栏</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 响应式配置 -->
        <el-form-item label="响应式布局">
          <el-switch v-model="configForm.responsive" />
        </el-form-item>

        <!-- 内容区域配置 -->
        <el-form-item label="内容区域宽度">
          <el-slider
            v-model="configForm.contentWidth"
            :max="1600"
            :min="800"
            :step="50"
            show-input
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
          <el-button @click="resetConfig">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 预览区域 -->
    <el-card class="preview-card">
      <template #header>
        <div class="card-header">
          <span>布局预览</span>
        </div>
      </template>
      <div
        :style="{
          width: `${configForm.contentWidth}px`,
          maxWidth: '100%',
        }"
        class="layout-preview"
      >
        <div
          v-if="configForm.components.includes('header')"
          class="preview-header"
        >
          顶部导航栏
        </div>
        <div class="preview-content">
          <div
            v-if="configForm.components.includes('sidebar')"
            class="preview-sidebar"
          >
            侧边菜单栏
          </div>
          <div class="preview-main">主要内容区域</div>
        </div>
        <div
          v-if="configForm.components.includes('footer')"
          class="preview-footer"
        >
          底部信息栏
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.home-config-container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.config-card,
.preview-card {
  flex: 1;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.layout-preview {
  margin: 0 auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.preview-header,
.preview-footer {
  padding: 20px;
  text-align: center;
  background-color: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.preview-footer {
  border-top: 1px solid #dcdfe6;
  border-bottom: none;
}

.preview-content {
  display: flex;
  min-height: 400px;
}

.preview-sidebar {
  width: 200px;
  padding: 20px;
  background-color: #f5f7fa;
  border-right: 1px solid #dcdfe6;
}

.preview-main {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff;
}
</style>
