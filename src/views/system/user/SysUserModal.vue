<script lang="ts" setup>
import type { UploadProps } from 'element-plus';

import type { SysUser } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useAccessStore } from '@vben/stores';

import { Plus } from '@element-plus/icons-vue';
import { ElButton, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { getByUserId, useRequestHandle as useDept } from '#/api/system/dept';
import { getPostIdsByUserId } from '#/api/system/sysPost';
import { useRequestHandle } from '#/api/system/user';
import DeptSelector from '#/components/business/DeptSelector.vue';
import { $t } from '#/locales';

import { formSchema } from './user.data';

const emit = defineEmits(['success']);

const departmentTreeData = ref<any[]>([]);

const formData = ref<SysUser>();
const isUpdate = ref(false);

const getTitle = computed(() => {
  return isUpdate.value ? '修改用户' : '创建用户';
});

const [Form, formApi] = useVbenForm({
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  wrapperClass: 'grid-cols-2',
  schema: formSchema(false),
  showDefaultActions: false,
});

function resetForm() {
  formApi.resetForm();
  formApi.setValues(formData.value || {});
}
const imageUrl = ref('');
const [Modal, modalApi] = useVbenModal({
  class: 'w-[60%] h-[90%] ',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const data = await formApi.getValues();
      try {
        await (isUpdate.value
          ? useRequestHandle.edit(data)
          : useRequestHandle.add(data));
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  openAutoFocus: true,
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<{ data: SysUser; isUpdate: boolean }>();
      isUpdate.value = data.isUpdate;
      formApi.updateSchema(formSchema(isUpdate.value));
      if (data.data) {
        // 获取用户的 部门
        data.data.deptIds = await getByUserId(data.data.userId);
        data.data.postIds = await getPostIdsByUserId(data.data.userId);
        formData.value = data.data;
        imageUrl.value = formData.value?.avatar || '';
        formApi.setValues(formData.value);
      } else {
        imageUrl.value = '';
      }
    }
  },
});
const initDepartmentData = async () => {
  departmentTreeData.value = await useDept.tree();
};
initDepartmentData();
/**
 * 处理头像成功
 * @param response
 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
  imageUrl.value = response;
  formApi.setFieldValue('avatar', response);
};
const allowedImageTypes = new Set([
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
/**
 * 在头像上传之前处理
 * @param rawFile
 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 检查文件类型
  if (!allowedImageTypes.has(rawFile.type)) {
    ElMessage.error('头像图片格式不支持！');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像图片大小不能超过2MB！');
    return false;
  }
  return true;
};
const accessStore = useAccessStore();

const headers = {
  Authorization: `Bearer ${accessStore.accessToken}`,
};
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4">
      <template #deptIds="slotProps">
        <DeptSelector v-bind="slotProps" :data="departmentTreeData" />
      </template>
      <template #avatar>
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          :headers="headers"
          name="file"
          action="/api/oss/object/elsfs"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
    </Form>
    <template #prepend-footer>
      <div class="flex-auto">
        <ElButton type="primary" danger @click="resetForm">
          {{ $t('common.reset') }}
        </ElButton>
      </div>
    </template>
  </Modal>
</template>
<style scoped lang="less">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
