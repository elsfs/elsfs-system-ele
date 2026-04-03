import type { VbenFormSchema } from '#/adapter/form';

/**
 * 表单
 */
export const formSchema: VbenFormSchema[] = [
  {
    label: 'id',
    fieldName: 'aiKnowledgeBaseId',
    component: 'Input',
    hideLabel: true,
    componentProps: {
      type: 'hidden',
    },
  },
  {
    label: '知识库名称',
    fieldName: 'name',
    component: 'Input',
    rules: 'required',
    componentProps: {
      placeholder: '请输入知识库名称',
      // 是否展示字数
      showCount: true,
      maxlength: 64,
    },
  },

  {
    label: '知识库描述',
    field: 'descr',
    component: 'InputTextArea',
    componentProps: {
      placeholder:
        '描述知识库的内容，详尽的描述将帮助AI能深入理解该知识库的内容，能更准确的检索到内容，提高该知识库的命中率。',
      // 是否展示字数
      showCount: true,
      maxlength: 256,
    },
  },
  {
    label: '向量模型',
    field: 'embedId',
    required: true,
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: "airag_model where model_type = 'EMBED',name,id",
    },
  },
  {
    label: '状态',
    field: 'status',
    required: true,
    component: 'JDictSelectTag',
    componentProps: {
      options: [
        { label: '启用', value: 'enable' },
        { label: '禁用', value: 'disable' },
      ],
      type: 'radioButton',
    },
    defaultValue: 'enable',
  },
];
