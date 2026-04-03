<!--字典详情 -->
<script setup lang="ts">
import type { SysDict } from '#/api/devOps/dict';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Promotion } from '@element-plus/icons-vue';

import DictItemTable from './DictItemTable.vue';
import DictItemTree from './DictItemTree.vue';

const data = ref<SysDict>();
const [Modal, modalApi] = useVbenModal({
  class: 'w-[60%]',
  openAutoFocus: true,
  // 显示取消按钮
  showCancelButton: false,
  // 显示确认按钮
  showConfirmButton: false,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});
</script>

<template>
  <template>
    <Modal :title="data?.dictName">
      <div class="w-full">
        <div class="flex" style="border: 2px solid rgb(120 121 222 / 90%)">
          <div>
            <span> 字典名称： </span>
            <span class="mr-4">
              <template v-if="data?.website">
                <el-button class="check-style" type="success">
                  <el-icon size="30"><Promotion /></el-icon>
                  <a :href="data.website" target="_blank">
                    {{ data?.dictName }}
                  </a>
                </el-button>
              </template>
              <template v-else>
                {{ data?.dictName }}
              </template>
            </span>
          </div>
          <div>
            字典编码:
            <span class="mr-4 text-blue-800">
              {{ data?.dictCode }}
            </span>
          </div>
          <div v-if="data.stdNo">
            标准号:
            <span class="mr-4 text-blue-800">
              {{ data?.stdNo }}
            </span>
          </div>
          <div v-if="data.stdCategory">
            标准类别:
            <span class="mr-4 text-blue-800">
              {{ data?.stdCategory }}
            </span>
          </div>
          <div v-if="data.dictDesc">
            字典描述:
            <span class="mr-4 text-blue-800">
              {{ data?.dictDesc }}
            </span>
          </div>
        </div>
      </div>
      <template v-if="data.isTree">
        <DictItemTree v-if="data.isTree" :dict="data" />
      </template>
      <template v-else>
        <DictItemTable v-if="!data.isTree" :dict="data" />
      </template>
    </Modal>
  </template>
</template>

<style scoped>
.check-style {
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #016dd9;
  border: none;
  border-radius: 10em;
}

.check-style:hover {
  animation: shake3856 0.3s linear infinite both;
}

@keyframes shake3856 {
  0% {
    transform: translate(0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(-2px, -2px);
  }

  60% {
    transform: translate(2px, 2px);
  }

  80% {
    transform: translate(2px, -2px);
  }

  100% {
    transform: translate(0);
  }
}
</style>
