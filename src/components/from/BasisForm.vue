<script setup lang="ts">
import type { FormInstance } from 'element-plus';

import type { FormConfig, FormItem as FormItemType } from './types';

import { computed, onMounted, ref, watch } from 'vue';

import FormItem from './FormItem';

interface Props {
  modelValue: Record<string, any>;
  config: FormConfig;
  items: FormItemType[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const formRef = ref<FormInstance>();
const colSpan = computed(() => props.config.span || 12);

// 初始化默认值
const initDefaultValues = () => {
  const newValue = { ...props.modelValue };
  let hasChanges = false;

  props.items.forEach((item) => {
    if (newValue[item.prop] === undefined && item.defaultValue !== undefined) {
      newValue[item.prop] = item.defaultValue;
      hasChanges = true;
    }
  });

  if (hasChanges) {
    emit('update:modelValue', newValue);
  }
};

// 组件挂载时初始化默认值
onMounted(initDefaultValues);

const handleInput = (prop: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [prop]: value,
  });
};

watch(
  () => props.modelValue.deptIds,
  (newVal) => {
    if (newVal && !Array.isArray(newVal)) {
      handleInput('deptIds', [newVal]);
    }
  },
  { immediate: true },
);

defineExpose({
  validate: () => formRef.value?.validate(),
  resetFields: () => formRef.value?.resetFields(),
});
</script>

<template>
  <el-form
    ref="formRef"
    :label-position="config.labelPosition"
    :label-width="config.labelWidth"
    :model="modelValue"
    :size="config.size"
  >
    <el-row :gutter="20">
      <el-col v-for="item in items" :key="item.prop" :span="colSpan">
        <el-form-item :label="item.label" :prop="item.prop" :rules="item.rules">
          <FormItem
            :item="item"
            :model-value="modelValue[item.prop]"
            @update:model-value="(val) => handleInput(item.prop, val)"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <slot name="footer"></slot>
  </el-form>
</template>

<style scoped>
.el-form {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 18px;
}
</style>
