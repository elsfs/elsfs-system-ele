<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { useDescription } from '#/components/description';

import { useDetailSchema } from './subdomain.data';

const [Descriptions, api] = useDescription({
  border: true,
  column: 2,
  schema: useDetailSchema(),
});
const [Modal, modalApi] = useVbenModal({
  title: '详情',
  footer: false,
  class: 'w-[60%]',
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      api.setDescProps({
        data: modalApi.getData(),
      });
    }
  },
});
</script>

<template>
  <Modal>
    <ElCard class="min-h-[10%]">
      <Descriptions>
        <template #tagsRaw="{ data }">
          <template v-if="data.tagsRaw">
            <ElTag
              class="mr-2"
              type="success"
              v-for="tag in data.tagsRaw.split(',')"
              :key="tag"
            >
              {{ tag }}
            </ElTag>
          </template>
        </template>
      </Descriptions>
    </ElCard>
  </Modal>
</template>

<style scoped></style>
