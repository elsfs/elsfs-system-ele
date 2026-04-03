<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const data = ref();

const [Modal, modalApi] = useVbenModal({
  title: '轮播图',
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>
<template>
  <Modal>
    <div class="flex-col-center">外部传递数据： {{ data }}</div>
  </Modal>
</template>
