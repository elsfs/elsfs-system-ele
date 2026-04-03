import type { Component } from 'vue';

import type { FormItem } from './types';

import { defineComponent, h, PropType } from 'vue';

import {
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
  ElSwitch,
  ElTimePicker,
} from 'element-plus';

import DeptSelector from '../business/DeptSelector.vue';

const componentMap: Record<string, Component> = {
  'el-input': ElInput,
  'el-select': ElSelect,
  'el-date-picker': ElDatePicker,
  'el-time-picker': ElTimePicker,
  'el-input-number': ElInputNumber,
  'el-switch': ElSwitch,
  'el-radio-group': ElRadioGroup,
  'el-input-textarea': ElInput,
  dept: DeptSelector,
};

export default defineComponent({
  name: 'FormItem',
  props: {
    item: {
      type: Object as PropType<FormItem>,
      required: true,
    },
    defaultValue: {
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
      required: false,
    },
    modelValue: {
      type: [String, Number, Boolean, Array, Object] as PropType<any>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const handleValueChange = (value: any) => {
      emit('update:modelValue', value);
    };
    return () => {
      const Component = componentMap[props.item.component];
      if (!Component) return null;

      const commonProps = {
        modelValue: props.modelValue,
        'onUpdate:modelValue': handleValueChange,
        placeholder: props.item.componentProps?.placeholder,
        ...props.item.componentProps,
      };

      // 特殊处理 textarea
      if (props.item.component === 'el-input-textarea') {
        return h(Component, {
          ...commonProps,
          type: 'textarea',
        });
      }

      // 处理带选项的组件
      if (props.item.component === 'el-select') {
        return h(Component, { ...commonProps }, () =>
          props.item.options?.map((option) =>
            h(ElOption, {
              key: option.value,
              label: option.label,
              value: option.value,
            }),
          ),
        );
      }

      if (props.item.component === 'el-radio-group') {
        return h(Component, commonProps, () => {
          return props.item.componentProps?.options?.map((option) =>
            h(
              ElRadio,
              {
                key: option.value,
                value: option.value,
                modelValue: props.modelValue,
                'onUpdate:modelValue': handleValueChange,
              },
              () => option.label,
            ),
          );
        });
      }

      // 默认渲染
      return h(Component, commonProps);
    };
  },
});
