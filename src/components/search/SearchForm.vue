<script lang="ts" setup>
import type { FormConfig } from '#/components/from/types';

import { computed, ref, watch } from 'vue';

import { ArrowDown, ArrowUp, Search } from '@element-plus/icons-vue';

import BasisForm from '#/components/from/BasisForm.vue';

interface SearchFormProps {
  searchConfig: any[];
  colCount?: number;
  showCollapse?: boolean;
  defaultShowCount?: number;
  showReset?: boolean;
}

const props = withDefaults(defineProps<SearchFormProps>(), {
  colCount: 3,
  showCollapse: true,
  defaultShowCount: 3,
  showReset: false,
});

const emit = defineEmits(['search', 'reset']);

// 搜索表单数据
const formData = ref<Record<string, any>>({});
// 是否展开
const isExpand = ref(false);

// 计算实际显示的搜索项
const displayedItems = computed(() => {
  if (!props.showCollapse || isExpand.value) {
    return props.searchConfig;
  }
  return props.searchConfig.slice(0, props.defaultShowCount);
});

// 表单配置
const formConfig: FormConfig = {
  labelWidth: 'auto',
  size: 'default',
  span: 8, // 每个表单项占据的列数
};

// 初始化表单数据
const initFormData = () => {
  props.searchConfig.forEach((item) => {
    formData.value[item.prop] = '';
  });
};

// 搜索
const handleSearch = () => {
  emit('search', formData.value);
};

// 重置
const handleReset = () => {
  initFormData();
  emit('reset');
};

// 切换展开/收起
const toggleExpand = () => {
  isExpand.value = !isExpand.value;
};

// 监听配置变化，重新初始化表单
watch(
  () => props.searchConfig,
  () => {
    initFormData();
  },
  { immediate: true },
);
</script>

<template>
  <div class="search-form">
    <BasisForm v-model="formData" :config="formConfig" :items="displayedItems">
      <template #footer>
        <div class="search-form-buttons">
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button v-if="showReset" @click="handleReset">重置</el-button>
          <el-button
            v-if="
              props.showCollapse &&
              props.searchConfig.length > props.defaultShowCount
            "
            link
            type="primary"
            @click="toggleExpand"
          >
            {{ isExpand ? '收起' : '展开' }}
            <el-icon>
              <component :is="isExpand ? ArrowUp : ArrowDown" />
            </el-icon>
          </el-button>
        </div>
      </template>
    </BasisForm>
  </div>
</template>

<style lang="scss" scoped>
.search-form {
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color-light);
  border-radius: 4px;

  :deep(.el-form) {
    padding: 0;
  }

  .search-form-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    padding: 8px 16px 0;
  }
}

@media (max-width: 768px) {
  .search-form {
    .search-form-buttons {
      margin-top: 16px;
    }
  }
}
</style>
